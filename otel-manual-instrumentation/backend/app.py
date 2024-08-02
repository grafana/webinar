from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from opentelemetry import trace
from opentelemetry import metrics
from opentelemetry.trace import SpanKind

CUSTOMER_COUNTRY = 'customer.country'

app = Flask(__name__)
# This is a placeholder for a cache of prices, so we can still show the items if the stock API fails.
prices_from_cache = {
    'apple': {"price": 0.5, "age": 3600},
    'banana': {"price": 0.3, "age": 600},
    'orange': {"price": 0.2, "age": 1800},
}
prices = {
    'apple': 0.3,
    'banana': 0.2,
    'orange': 0.15,
}
CORS(app)
cart_content = {}

price_age = metrics.get_meter("app").create_histogram(
    "price_age", unit="s", description="A histogram of price age in seconds",
)

tracer = trace.get_tracer("app")


def calculate_total_price() -> float:
    total_price = sum(prices[item] * quantity for item, quantity in cart_content.items())
    return round(total_price, 2)


def call_stock_api() -> dict:
    # This is a placeholder for a call to a stock API.
    # This could be a call to an external service, or a call to a local function.
    # We simulate a failure by passing a parameter in the request.
    # We also create spans to represent the client and server side of the call.
    # If you call a real service, those spans will be created automatically.
    with tracer.start_as_current_span("get_price", kind=SpanKind.CLIENT):
        set_country()
        with tracer.start_as_current_span("get_price", kind=SpanKind.SERVER):
            set_country()
            # Parameter use for testing purposes, so we can force a failure.
            should_fail = request.args.get('fail_stock_api', default=False, type=bool)
            if should_fail:
                # create a span to represent the stock API call
                raise "Error calling stock API"
            return prices


def customer_country() -> str:
    country = request.args.get(CUSTOMER_COUNTRY, default=None, type=str)
    if not country:
        country = "unknown"
    return country


def report_price_age(age: int):
    # without manual instrumentation, we can see the failure rate of the stock API - but not the price age
    price_age.record(age, {CUSTOMER_COUNTRY: (customer_country())})


def retrieve_prices() -> dict:
    try:
        result = call_stock_api()
        for _, _ in result.items():
            report_price_age(0)
        return result
    except:
        # If the stock API fails, we want to return the last known prices so the user can still see the items.
        for _, price in prices_from_cache.items():
            report_price_age(price["age"])
        return {k:v["price"] for (k,v) in prices_from_cache.items()}


def set_country():
    trace.get_current_span().set_attribute(CUSTOMER_COUNTRY, customer_country())


@app.route('/get_items', methods=['GET'])
def get_items() -> Response:
    set_country()
    return jsonify(retrieve_prices())


@app.route('/view_cart', methods=['GET'])
def view_cart() -> Response:
    set_country()
    total_price = calculate_total_price()
    return jsonify({
        'cart_content': cart_content,
        'total_price': total_price,
    })


@app.route('/add_to_cart', methods=['POST'])
def add_to_cart() -> Response:
    set_country()
    data = request.get_json()
    item = data['item']
    quantity = data['quantity']
    cart_content[item] = cart_content.get(item, 0) + quantity
    if cart_content[item] < 0:
        cart_content[item] = 0
    total_price = calculate_total_price()
    return jsonify({
        'cart_content': cart_content,
        'total_price': total_price,
    })


if __name__ == '__main__':
    app.run(debug=True)
