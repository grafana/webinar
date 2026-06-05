import React, { useCallback, useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [optionsItems, setOptionsItems] = useState({});
  const [cartContent, setCartContent] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [quantityToAdd, setQuantityToAdd] = useState(1);
  const serverPort = "8081";

  const makeGetRequest = useCallback(async (url, params) => {
    return await axios.get(
      url,
      {
        params: params
      }
    );
  }, []);

  const fetchData = useCallback(async () => {
    const params = new URLSearchParams(window.location.search);

    try {
      const itemsResponse = await makeGetRequest(`http://localhost:${serverPort}/get_items`, params)
      setOptionsItems(itemsResponse.data);
    } catch (error) {
      console.error("Error fetching items data:", error);
    }
    try {
      const response = await makeGetRequest(`http://localhost:${serverPort}/view_cart`, params)
      setCartContent(response.data.cart_content);
      setTotalPrice(response.data.total_price);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  }, [makeGetRequest]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const makePostRequest = async (url, data, params) => {
    await axios.post(
      url,
      data,
      {
        params: params
      }
    );
  }

  const addToCart = async () => {
    const params = new URLSearchParams(window.location.search);
    try {
      await makePostRequest(
        `http://localhost:${serverPort}/add_to_cart`,
        {
          item: document.querySelector('#options').value,
          quantity: quantityToAdd,
        },
        params
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