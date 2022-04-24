import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import authHeader from "../services/authHeader";
import { constants } from "../config/config";
import "../styles/item.css";
import { useSelector } from "react-redux";

function Item() {
  const navigate = useNavigate();
  const [item, setItem] = useState({});
  const [quantity, setQuantity] = useState(1);
  const currency = useSelector(state => state.user.currency);
  let { itemID } = useParams();
  console.log("item id in itemjs = " + itemID);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/", { replace: true });
    }
  }, []);
/* ------------------------------- add-to-cart ------------------------------ */
  const addToCart = async () => {
    const data = {};
    data.userID = localStorage.getItem("userID");
    data.itemID = itemID;
    data.quantity = quantity;
    axios
      .post(`http://${constants.IP.ipAddress}:3001/api/v1/user/cart/${data.userID}`, data, {
        headers: authHeader(),
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("successfully added to cart....");
          navigate("/", { replace: true });
        } else if (response.data.code === 400) {
          console.log("there was an issue in adding to cart...");
        }
      })
      .catch((err) => {
        console.log(
          "there was an error in adding items to cart and the error message is...",
          err
        );
      });
  };

  const addToFavourites = async () => {
    const data = {};
    data.userid = localStorage.getItem("userID");
    data.itemID = itemID;
    axios
      .post(`http://${constants.IP.ipAddress}:3001/addFavourite/`, data, {
        headers: authHeader(),
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("successfully added to favourites....");
          navigate("/", { replace: true });
        } else if (response.data.code === 400) {
          console.log("there was an issue in adding to favourites...");
        }
      })
      .catch((err) => {
        console.log(
          "there was an error in adding items to favourites and the error message is...",
          err
        );
      });
  };

  const quantityHandler = (e) => {
    e.preventDefault();
    setQuantity(e.target.value);
  };

  /* -------------------------- get-data-on-page-load ------------------------- */
  useEffect(() => {
    axios
      .get(`http://${constants.IP.ipAddress}:3001/api/v1/item/${itemID}`, {
        headers: authHeader(),
      })
      .then((response) => {
        console.log(response.data);
        if (response.status === 200) {
          const temp_item = response.data[0];
          console.log("the items are.......", temp_item);
          setItem(temp_item);
        } else if (response.data.code === 500) {
          console.log(response.data.message);
        }
      })
      .catch((err) => {
        console.log("error in getting all items in the item page and the error is", err);
      });
  }, []);
  let quantity_code;
  let is_out_of_stock = item.quantity > 0;
  if (is_out_of_stock) {
    quantity_code = (
      <div>
        <span>
          <h5>
            <label htmlFor="quantity">Quantity:</label>
          </h5>
        </span>

        <span>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="1"
            max={item.quantity}
            value={quantity}
            onChange={quantityHandler}
            style={{ height: "20px", width: "100px" }}
          />
          <br />
          <p>In Stock: {item.quantity}</p>
        </span>
      </div>
    );
  } else {
    quantity_code = (
      <p style={{ color: "red", fontSize: "1.5em" }}>
        sorry, the item is out of stock
      </p>
    );
  }

  return (
    <div>
      <div>
        <Navbar />
      </div>
      <br />
      <div className="parent-flex-item">
        <div className="picture">
          <img
            alt="Item"
            // src="https://i.etsystatic.com/9649073/r/il/64f4bc/1303342076/il_794xN.1303342076_guda.jpg"
            src={item.displayPicture}
            id="IMG_18"
            // className="homeitem_picture"
          />
        </div>
        <div className="item-details">
          <div id="DIV_1" style={{"margin-top": "44rem"}}>
            {/* <div id="DIV_3"></div> <span id="SPAN_22">12,964 sales</span> */}
            <div id="DIV_3"></div> <span id="SPAN_22">{item.salesCount} sales</span>
            <span> | </span>
            <span>{item.shopName}</span>
            <div id="DIV_46" style={{ display: "block" }}>
              <h1 className="item-description">{item.name}</h1>
              <h5>{item.description}</h5>
            </div>
            <br />
            {quantity_code}
            <br />
            <div style={{ display: "block" }}>
              <p className="price">
                <span id="SPAN_2">Price:</span> ${item.price}
              </p>
            </div>
            <div className="wrapper-to-align-buttons">
              <button
                onClick={addToCart}
                className="add-to-cart-button"
                type="submit"
              >
                Add to cart
              </button>
              <br />
              <Link to="/shoppage" state={{ shopid: item.shopid }}>
                <button
                  type="submit"
                  // onClick={addToFavourites}
                  className="add-to-favourites-button"
                >
                  Go to Shop
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Item;
