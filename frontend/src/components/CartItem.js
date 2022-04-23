import React from "react";
import "./Cart.css";

function CartItem(props) {
  // console.log("the props inside card line page is ", props);
  return (
    <div>
      <div className="Cart-Items">
        <div className="image-box"></div>
        <div className="about">
          <h1 className="title">{props.name}</h1>
          <br></br>
        </div>
        <div className="counter">
          <div className="btn">+</div>
          <div className="count">{props.quantity}</div>
          <div className="btn">-</div>
        </div>
        <div className="prices">
          <div className="amount">
            ${parseInt(props.quantity) * parseInt(props.price)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
