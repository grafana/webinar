from flask import Flask, jsonify, request
from flask_cors import CORS
from opentelemetry import trace
from opentelemetry import metrics

CUSTOMER_COUNTRY = 'customer.country'

app = Flask(__name__)
fallback_prices = {
    'apple': 0.5,
    'banana': 0.3,
    'orange': 0.25,
}
prices = {
    'apple': 0.3,
    'banana': 0.2,
    'orange': 0.15,
}
CORS(app)
cart_content = {}

price_accuracy = metrics.get_meter("app").create_histogram(
    "price_accuracy", unit="1", description="A counter of price accuracy"
)


def calculate_total_price() -> float:
    total_price = sum(prices[item] * quantity for item, quantity in cart_content.items())
    return round(total_price, 2)


def call_stock_api() -> dict:
    # This is a placeholder for a call to a stock API.
    # This could be a call to an external service, or a call to a local function.

    # Parameter use for testing purposes, so we can force a failure.
    should_fail = request.args.get('fail_stock_api', default=False, type=bool)
    if should_fail:
        raise "Error calling stock API"
    return prices


def customer_country() -> str:
    country = request.args.get(CUSTOMER_COUNTRY, default=None, type=str)
    if not country:
        country = "unknown"
    return country


def report_price_accuracy(accuracy: int):
    # use values that are clearly distinguishable with the default histogram boundaries:
    # https://opentelemetry-python.readthedocs.io/en/latest/sdk/metrics.view.html
    price_accuracy.record(accuracy, {CUSTOMER_COUNTRY: (customer_country())})


def retrieve_prices() -> dict:
    try:
        result = call_stock_api()
        report_price_accuracy(10)
        return result
    except:
        report_price_accuracy(5)
        return fallback_prices


def set_country():
    trace.get_current_span().set_attribute(CUSTOMER_COUNTRY, customer_country())


@app.route('/get_items', methods=['GET'])
def get_items():
    # Parameter use for testing purposes, so we can force a failure.
    should_fail = request.args.get('fail', default=False, type=bool)

    if should_fail:
        return "Error returning", 500
    set_country()
    return jsonify(retrieve_prices())


@app.route('/view_cart', methods=['GET'])
def view_cart():
    set_country()
    total_price = calculate_total_price()
    return jsonify({
        'cart_content': cart_content,
        'total_price': total_price,
    })


@app.route('/add_to_cart', methods=['POST'])
def add_to_cart():
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
