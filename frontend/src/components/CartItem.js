import axios from "axios";
import React, { useState } from "react";
import "../styles/cart.css";
import authHeader from "../services/authHeader";
import { updateCart } from "../redux/actions";
import { useDispatch } from "react-redux";
import { Form } from 'react-bootstrap';
import "../styles/cartItem.css"

function CartItem({itemID, name, quantity, price, items, setItems, setSum}) {
  const userID = localStorage.getItem("userID");
  const dispatch = useDispatch();
  const [isGiftPack, setGiftPack] = useState(false);
  const [instructions, setInstructions] = useState("");
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
  /* -------------------------------------------------------------------------- */
  
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
  /* ------------------------ submit-gift-wrap-options ------------------------ */
  const submitGiftWrapOptions = (e) => {
    setGiftPack(e.target.checked);
    items.map(
      (item) => {
        if(item._id == itemID){
          item.isGiftPack = e.target.checked;
          if(e.target.checked==false){
            item.instructions="";
          }
        }
      }
    );
    console.log(items)
    setItems(items);
  }
  /* ------------------------ submitSpecialInstructions ----------------------- */
  const submitSpecialInstructions = (e) => {
    items.map(
      (item) => {
        if(item._id == itemID){
          item.isGiftPack = true
          item.instructions = instructions;
        }
      }
    );
    console.log(items)
    setItems(items);
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
        <div onClick = {decrementCount} className="btn">-</div>
          <div className="count">{quantity}</div>
          <div onClick = {incrementCount} className="btn">+</div>
        </div>
        <div className="prices">
          <div className="amount">
            ${parseInt(quantity) * parseFloat(price)}
          </div>
        </div>
      </div>
      <span className="filter-col">
            <Form.Check size="sm" className="gift-packed" value={isGiftPack} onChange={submitGiftWrapOptions} type="checkbox" label="Giftwrap" />
        </span>
        <span>
        {isGiftPack ?
        <span><Form.Control size="sm" className="specialInstructions" onChange={(e)=>setInstructions(e.target.value)} value = {instructions} type="text" id="specialInstructions" name="specialInstructions" placeholder="Any special instructions?"/> 
        <button onClick={submitSpecialInstructions}>submit</button></span>
         : 
         <span></span>}
        </span>
    </div>
  );
}

export default CartItem;
