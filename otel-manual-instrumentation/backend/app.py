from flask import Flask, jsonify, request
from flask_cors import CORS
from opentelemetry import trace
from urllib import parse

app = Flask(__name__)
prices = {
    'apple': 0.5,
    'banana': 0.3,
    'orange': 0.25,
}
CORS(app)
cart_content = {}

def calculate_total_price():
    total_price = sum(prices[item] * quantity for item, quantity in cart_content.items())
    return round(total_price, 2)

def set_country():
    country = request.args.get('customer.country', default=None, type=str)
    if country:
        current_span = trace.get_current_span()
        current_span.set_attribute("customer.country", country)

@app.route('/get_items', methods=['GET'])
def get_items():
    # Parameter use for testing purposes, so we can force a failure.
    should_fail = request.args.get('fail', default=False, type=bool)

    if should_fail:
        return "Error returning", 500
    set_country()
    return jsonify(prices)

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
