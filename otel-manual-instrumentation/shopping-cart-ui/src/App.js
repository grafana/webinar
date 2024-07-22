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

  const getUserParams = async () => {
    const ipInfo = await axios.get("http://ipinfo.io")
    return {
      "customer.country": `${ipInfo.data.country}`,
    }
  }

  const makeGetRequest = async (url) => {
    return await axios.get(
      url,
      {
        params: await getUserParams()
      }
    );
  }

  const makePostRequest = async (url, data) => {
    await axios.post(
      url,
      data,
      {
        params: await getUserParams()
      }
    );
  }

  const fetchData = async () => {
    const params = new URLSearchParams(window.location.search);
    // Parameter use for testing purposes, so we can force a failure.
    const forceFail = params.get("fail_stock_api") ? "?fail_stock_api=true" : "";

    try {
      const itemsResponse = await makeGetRequest(`http://localhost:${serverPort}/get_items${forceFail}`)
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
      const response = await makeGetRequest(`http://localhost:${serverPort}/view_cart`)
      setCartContent(response.data.cart_content);
      setTotalPrice(response.data.total_price);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  const addToCart = async () => {
    try {
      await makePostRequest(
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