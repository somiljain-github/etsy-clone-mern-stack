import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { constants } from "../config/config";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import authHeader from "../services/authHeader";
import { useSelector } from "react-redux";
import HomeCardSingle from "./HomeCardSingle";

function Favourites() {
  /* ------------------------------ declare-const ----------------------------- */
  const [favouriteItems, setFavouriteItems] = useState([
    { price: 0, picture: "image", name: "name" },
  ]);
  const [itemsListCards, setItemListCards] = useState("");
  const [items, setItems] = useState("");
  let allItems = useSelector((state) => state.items);
  const navigate = useNavigate();
  /* ------------------------ verify-user-is-logged-in ------------------------ */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/", { replace: true });
    }
  }, []);
  /* ----------------------------- get-favourites ----------------------------- */
  useEffect(() => {
    console.log("gere");
    const userID = localStorage.getItem("userID");
    axios
      .get(
        `http://${constants.IP.ipAddress}:3001/api/v1/user/getFav/${userID}`,
        { headers: authHeader() }
      )
      .then((response) => {
        // console.log("here", response.status);
        if (response.status == 200) {
          // console.log(response.data.favouriteItems);
          setItems(response.data.favouriteItems);
        }
      })
      .catch((error) => {
        console.log(
          "faced an error while getting favourites and the error is",
          error
        );
      });
  }, []);
  /* -------------------------- convert-items-to-jsx -------------------------- */
  useEffect(() => {
    if (items === undefined) {
      return;
    }
    // console.log(items);
    setItemListCards(
      items.map((item) => {
        console.log(item);
        let props = {
          name: item.name,
          price: item.price,
          displayPicture: item.displayPicture,
          itemID: item._id,
        };
        console.log(props);
        return <HomeCardSingle key={props.itemID} {...props} />;
      })
    );
  }, [items]);
  return (
    <div>
      <Navbar />
      <div>
        <main>
          <section className="cards">{itemsListCards}</section>
        </main>
      </div>
    </div>
  );
}

export default Favourites;
