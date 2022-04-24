import axios from "axios";
import React from "react";
import "../styles/cart.css";
import authHeader from "../services/authHeader";
import { updateCart } from "../redux/actions";
import { useDispatch, useSelector } from "react-redux";

function CartItem({itemID, name, quantity, price, setItems, setSum}) {
  const userID = localStorage.getItem("userID");
  const dispatch = useDispatch();
  // const cart = useSelector(state => state.user.cart);
  /* -------------------------- increment-item-count -------------------------- */
  const incrementCount = () => {
    console.log("about to increment count for", itemID);
    const data = { itemID };
    axios.post(`http://localhost:3001/api/v1/user/incrementCartItemQuantity/${userID}`, data, {headers: authHeader()})
    .then(
      (response) => {
        if(response.status == 200){
          console.log("in the 200 loop for increment");
          let s = 0;
          const temp_items = response.data.cartItems;
          const cart = response.data.cart;
          dispatch(updateCart(cart));
          temp_items.map((item) => {
            let quantity = cart.filter(x => x === item._id).length;
            item.quantity = quantity;
            s = s + parseInt(quantity) * parseFloat(item.price);
          });
          setItems(temp_items);
          setSum(s);
        }
      }
    )
  }
  /* -------------------------- decrement-item-count -------------------------- */
  const decrementCount = () => {
    const data = { itemID };
    console.log("about to decrement count for", itemID);
    axios.post(`http://localhost:3001/api/v1/user/decrementCartItemQuantity/${userID}`, data, {headers: authHeader()})
    .then(
      (response) => {
        console.log(response.data);
        if(response.status == 200){
          console.log("in the 200 loop for decrement");
          let s = 0;
          const temp_items = response.data.cartItems;
          const cart = response.data.cart;
          dispatch(updateCart(cart));
          temp_items.map((item) => {
            let quantity = cart.filter(x => x === item._id).length;
            item.quantity = quantity;
            s = s + parseInt(quantity) * parseFloat(item.price);
            // setSum(sum + parseInt(item.quantity) * parseInt(item.price));
          });
          setItems(temp_items);
          setSum(s);
        }
      }
    )
    .catch(
      (error) => {
        console.log("There was an error while decrementing an item count and the error is", error);
      }
    )
  }
  /* ------------------------------- return-jsx ------------------------------- */
  return (
    <div>
      <div className="Cart-Items">
        <div className="image-box"></div>
        <div className="about">
          <h1 className="title">{name}</h1>
          <br></br>
        </div>
        <div className="counter">
          <div onClick = {incrementCount} className="btn">+</div>
          <div className="count">{quantity}</div>
          <div onClick = {decrementCount} className="btn">-</div>
        </div>
        <div className="prices">
          <div className="amount">
            ${parseInt(quantity) * parseFloat(price)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
