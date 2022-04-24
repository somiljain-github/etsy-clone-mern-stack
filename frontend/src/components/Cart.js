import React, { useState, useEffect } from "react";
import "../styles/cart.css";
import { constants } from "../config/config";
import axios from "axios";
import authHeader from "../services/authHeader";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import CartItem from "./CartItem";
import { useSelector } from "react-redux";

function Cart() {
  const [items, setItems] = useState([]);
  const [sum, setSum] = useState(0);
  const userID = localStorage.getItem("userID");
  const navigate = useNavigate();
  const cart = useSelector(state => state.user.cart);

  const URL = `http://${constants.IP.ipAddress}:3001/api/v1/user/cart/${userID}`;
  console.log(URL);
  useEffect(() => {
    axios.get(URL, {headers: authHeader()})
      .then((response) => {
        console.log("%%%%%%%%%%%%%%page refreshing");
        console.log("the items are...response.data....", response.data);
        if (response.status === 200) {
          let s = 0;
          const temp_items = response.data.cartItems;
          const cart = response.data.cart;
          temp_items.map((item) => {
            let quantity = cart.filter(x => x === item._id).length;
            item.quantity = quantity;
            s = s + parseInt(quantity) * parseFloat(item.price);
            // setSum(sum + parseInt(item.quantity) * parseInt(item.price));
          });
          setItems(temp_items);
          setSum(s);
        } else if (response.data.code === 500) {
          console.log(response.data.message);
          console.log("errrrrorrrrr");
        }
      })
      .catch((err) => {
        console.log("error in getting all items in the home page", err);
      });
  }, []);

  const placeOrder = (e) => {
    e.preventDefault();
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

  /* ------------------------------ preparing-jsx ----------------------------- */
  const items_list_cards = items.map((item) => {
    // console.log(item.name, item.quantity);
    let props = { itemID: item._id, name: item.name, price: item.price, quantity: item.quantity, setItems: setItems, setSum: setSum};
    return <CartItem key={item._id} {...props} />;
  });
  /* ------------------------ preparing-jsx-on-refresh ------------------------ */
  // useEffect(
  //   () =>{
  //     items_list_cards = items.map((item) => {
  //       // console.log(item.name, item.quantity);
  //       let props = { itemID: item._id, name: item.name, price: item.price, quantity: item.quantity, setItems: setItems, setSum: setSum};
  //       return <CartItem key={item._id} {...props} />;
  //     });
  //   }, [items]
  // );

  return (
    <div>
      <Navbar />
      <div className="CartContainer">
        <div className="Header">
          <h3 className="Heading">Shopping Cart</h3>
          <h5 className="Action">Remove all</h5>
        </div>

        {/* <CartHelper items_list={items} /> */}
        <div>
          <section>{items_list_cards}</section>
        </div>
        <hr />
        <div className="checkout">
          <div className="total">
            <div>
              <div className="Subtotal">Sub-Total</div>
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
