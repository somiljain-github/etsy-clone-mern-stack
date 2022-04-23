import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { InputGroup, FormControl, Button } from "react-bootstrap";
import Navbar from "./Navbar";
import "../styles/createshop.css";
import axios from "axios";
import authHeader from "../services/authHeader";
import { constants } from "../config/config";
import {  useDispatch } from "react-redux";
import { updateShopName } from "../redux/actions";

const CreateShop = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [shopName, setShopName] = useState("");
  const [shopAvailable, setShopNameAvailable] = useState(false);
  const [canShowAvailResult, setCanShowAvailResult] = useState(false);
  const [creatingShop, setCreatingShop] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const create = (e) => {
    e.preventDefault();
    console.log("in the submit button");

    const userID = localStorage.getItem("userID");
    const data = {
      shopName: shopName,
      userID: userID,
    };
    console.log(data);
    axios
      .post(`http://${constants.IP.ipAddress}:3001/api/v1/shop`, data, {
        headers: authHeader(),
      })
      .then((response) => {
        console.log(response.data.success);
        window.localStorage.setItem("shopName", shopName);
        const result = alert("Shop Created!!");
        dispatch(updateShopName( {shopName} ));
        navigate("/home", { replace: true });
      })
      .catch((err) => {
        console.log("error in creating shop and the error is", err);
      });
  };

  const check = (e) => {
    e.preventDefault();
    console.log("in the check button and the shopName is", shopName);
    axios
      .get(`http://${constants.IP.ipAddress}:3001/api/v1/shop/namecheck?shopName=${shopName}`, {
        headers: authHeader(),
      })
      .then((response) => {
        if (response.data.success && response.data.isShopNameUnique) {
          setShopNameAvailable(true);
          setCanShowAvailResult(true);
        } else {
          setShopNameAvailable(false);
          setCanShowAvailResult(true);
        }
        console.log("The data recieved while checking the shopName availibility is",response.data);
      })
      .catch((err) => {
        console.log("error in checking the shopName availibility shop and the error is", err);
      });
  };

  return (
    <div>
      <Navbar />
      <div className="create-shop-title">Name your Shop</div>
      <div className="create-shop-subtitle">
        Choose a memorable name that reflects your style
      </div>
      <div className="shop-create-name">
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Shop Name"
            onChange={(e) => {
              setShopName(e.target.value);
            }}
          />
          <Button
            variant="outline-secondary"
            id="button-addon2"
            onClick={check}
          >
            Check Availability
          </Button>
        </InputGroup>
      </div>
      <div className="create-shop-note">
        Your shop name will appear in tour shop and next to each of your listings throughout Etsy.
      </div>
      {canShowAvailResult && shopAvailable && (
        <div className="create-shop-avl">
          <div className="shopcreate-success">Available!</div>
          <div>
            <Button variant="outline-secondary" id="button-addon2" onClick={create}> Create Shop </Button>
          </div>
        </div>
      )}
      {canShowAvailResult && !shopAvailable && (
        <div className="create-shop-notavl">
          <div className="shopcreate-error">
            Not Available! Please choose a different name.
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateShop;
