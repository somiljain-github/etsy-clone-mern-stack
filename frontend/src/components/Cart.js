import React, { useState, useEffect } from "react";
import "../styles/cart.css";
import { constants } from "../config/config";
import axios from "axios";
import authHeader from "../services/authHeader";
import CartItem from "./CartItem";
import CartHelper from "./CartHelper";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [items, setItems] = useState([]);
  const [sum, setSum] = useState(0);
  const userId = localStorage.getItem("userid");
  const navigate = useNavigate();

  const api = `http://${constants.IP.ipAddress}:3001/cart/${userId}`;
  console.log(api);
  //   let sum = 0;
  useEffect(() => {
    axios
      .get(api, {
        headers: authHeader(),
      })
      .then((response) => {
        console.log("the items are...response.data....", response.data.items);
        if (response.status === 200) {
          let s = 0;
          const temp_items = response.data.items;
          setItems(temp_items);
          temp_items.map((item) => {
            console.log("jnfksd");
            s = s + parseInt(item.quantity) * parseInt(item.price);
            // setSum(sum + parseInt(item.quantity) * parseInt(item.price));
          });
          setSum(s);
        } else if (response.data.code === 500) {
          console.log(response.data.message);
          console.log("errrrrirrrrr");
        }
      })
      .catch((err) => {
        console.log("error in getting all items in the home page", err);
      });
  }, []);

  const placeOrder = (e) => {
    e.preventDefault();
    // const data = {
    //   itemName: name,
    //   photo : path,
    //   category: category,
    //   description : description,
    //   price : price,
    //   quantity : quantity,
    //   salesCount : 0,
    //   shopName : 'test',
    //   shopid : localStorage.getItem('shopid')
    // };
    axios
      .post(`http://${constants.IP.ipAddress}:3001/placeOrder/`, items, {
        headers: authHeader(),
      })
      .then((response) => {
        console.log(response.data.orderid);
        if (response.data.updateItems) {
          const result = alert("Order Placed!!");
          navigate("/home", { replace: true });
        }
      })
      .catch((err) => {
        console.log("error in adding cat", err);
      });
  };

  return (
    <div>
      <NavBar />
      <div className="CartContainer">
        <div className="Header">
          <h3 className="Heading">Shopping Cart</h3>
          <h5 className="Action">Remove all</h5>
        </div>

        <CartHelper items_list={items} />
        <hr />
        <div className="checkout">
          <div className="total">
            <div>
              <div className="Subtotal">Sub-Total</div>
              {/* <div className="items">2 items</div> */}
            </div>
            <div className="total-amount">${sum}</div>
          </div>
          <button className="button" onClick={placeOrder}>
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
