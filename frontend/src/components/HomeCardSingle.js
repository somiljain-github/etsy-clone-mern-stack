import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import axios from "axios";
import authHeader from "../services/authHeader";
import { constants } from "../config/config";
import { useSelector } from "react-redux";

function HomeCardSingle(props) {
  const itemLink = "/item/" + props.itemID;
  const userID = useSelector((state) => state.user._id);
  const addToFav = (itemID) => {
    // e.preventDefault();
    console.log("in the add fav button", itemID);
    const data = {
      itemID,
    };
    console.log(
      `http://${constants.IP.ipAddress}:3001/api/v1/user/addFav/${userID}`,
      data
    );
    axios
      .put(
        `http://${constants.IP.ipAddress}:3001/api/v1/user/addFav/${userID}`,
        data,
        {
          headers: authHeader(),
        }
      )
      .then((response) => {
        console.log(response.data);
        alert("Added to favourites!");
      })
      .catch((err) => {
        console.log("error in creating shop");
      });
  };

  return (
    <React.Fragment key={props.itemID}>
      <div className="card">
        <div className="card__image-container">
          <img src="https://images.unsplash.com/photo-1473283147055-e39c51463929?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1200&q=80" alt="displaying of the item"/>

          {/* <img src={props.picture} /> */}
        </div>
        <div className="card__content">
          <Link to={itemLink}>
            <p className="card__title text--medium">{props.name}</p>
          </Link>
          <div className="card__info">
            <p className="text--medium">Price: {props.price}</p>
            {/* <p className="card__price text--medium">Add to favourties</p> */}
            {/* <div onClick={addToFav} className="favouriteIcon">
              <UnfilledHeartIcon />
            </div> */}
            <button
              className="card__price text--medium"
              onClick={() => addToFav(props.itemID)}
            >
              Add to favourties
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default HomeCardSingle;
