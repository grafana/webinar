import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [optionsItems, setOptionsItems] = useState({});
  const [cartContent, setCartContent] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [quantityToAdd, setQuantityToAdd] = useState(1);
  const serverPort = "8081";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const params = new URLSearchParams(window.location.search);
    // Parameter use for testing purposes, so we can force a failure.
    const forceFail = params.get("fail") ? "?fail=true" : "";

    try {
      const itemsResponse = await axios.get(
        `http://localhost:${serverPort}/get_items${forceFail}`
      );
      setOptionsItems(itemsResponse.data);
    } catch (error) {
      console.error("Error fetching items data:", error);
      // Have a fallback option
      setOptionsItems({
        'apple': 1.0,
        'banana': 0.3,
        'orange': 0.25,
      })
    }
    try {
      const response = await axios.get(
        `http://localhost:${serverPort}/view_cart`
      );
      setCartContent(response.data.cart_content);
      setTotalPrice(response.data.total_price);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  const addToCart = async () => {
    try {
      await axios.post(
        `http://localhost:${serverPort}/add_to_cart`,
        {
          item: document.querySelector('#options').value,
          quantity: quantityToAdd,
        }
      );
      fetchData();
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <div className="app">
      <h1>Shopping Cart Example</h1>
      <div className="cart">
        <h2>Cart:</h2>
        <ul>
          {Object.entries(cartContent).map(([item, quantity]) => (
            <li key={item}>{`${quantity} ${item}(s)`}</li>
          ))}
        </ul>
        <h2>Total Price: ${totalPrice}</h2>
      </div>
      <div className="add-to-cart">
        <h2>Items:</h2>
        <div className="input-area">
          <input
            type="number"
            placeholder="Quantity"
            value={quantityToAdd}
            onChange={(e) => setQuantityToAdd(parseInt(e.target.value))}
          />
          <select name="options" id="options">
            {Object.entries(optionsItems).map(([itemName, itemValue]) => (
              <option value={itemName} key={itemName}>{`${itemName} ($${itemValue})`}</option>
            ))}
          </select>
        </div>
        <button onClick={addToCart}>Add to Cart</button>
      </div>
    </div>
  );
}

export default App;