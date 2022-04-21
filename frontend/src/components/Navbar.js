import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { constants } from "../config/config";
import authHeader from "../services/authHeader";
import "./NavBar.css";
import { ReactComponent as Logo } from "../images/etsy-vector-logo.svg";
import { ReactComponent as SearchIcon } from "../images/SearchIcon.svg";
import { ReactComponent as FavouritesIcon } from "../images/FavouritesIcon.svg";
import { ReactComponent as CartIcon } from "../images/CartIcon.svg";
import { ReactComponent as AccountProfileIcon } from "../images/AccountProfileIcon.svg";
import { ReactComponent as LogoutIcon } from "../images/LogoutIcon.svg";
import { ReactComponent as OrderIcon } from "../images/OrderIcon.svg";
import { ReactComponent as ShopIcon } from "../images/ShopIcon.svg";
import { connect } from "react-redux";
import { setItems } from "../redux/actions";

function Navbar({ items }) {
  const [searchQuery, setSearchQuery] = useState("");
  let searchChangehandler = (e) => {
    setSearchQuery(e.target.value);
  };
  const navigate = useNavigate();

  //this is to let the user search by pressing enter on the search bar input field
  let handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchFunction();
    }
  };

  let searchFunction = async () => {
    let URL = `http://${constants.IP.ipAddress}:3001/api/v1/item/search/${searchQuery}`;
    console.log("the search string is", searchQuery);
    if (searchQuery === "") {
      const userID = await localStorage.getItem("userID");
      URL = `http://${constants.IP.ipAddress}:3001/api/v1/item/getAll/${userID}`;
    }
    axios
      .get(URL, {
        headers: authHeader(),
      })
      .then((response) => {
        if (response.status === 200) {
          const temp_items = response.data;
          console.log(
            "the items recieved from sending the api are are.......",
            temp_items
          );
          setItems(temp_items);
        } else if (response.data.code === 500) {
          console.log(response.data.message);
        }
      })
      .catch((err) => {
        console.log(
          "error in getting all items in the search input field in navbar and the error is",
          err
        );
      });
  };
  const logout = () => {
    console.log("logging out function...");
    localStorage.clear();
    navigate("/login", { replace: true });
  };
  const temp = () => {
    alert("yo");
  };

  return (
    <div className="NavBar">
      <div className="logo">
        <Link to="/home">
          <Logo />
        </Link>
      </div>
      <div className="searchbar-div">
        <input
          type="text"
          name="search_query"
          className="searchbar-input-field"
          value={searchQuery}
          onKeyUp={handleKeyPress}
          onChange={searchChangehandler}
          placeholder="Search for anything"
        />
        <button onClick={searchFunction} className="navbar-search-button">
          <span className="search-icon">
            <SearchIcon />
          </span>
        </button>
      </div>
      <div className="rightSideIcons">
        <div className="navBarIcon">
          <Link to="/favourites">
            <FavouritesIcon />
          </Link>
        </div>
        <div className="navBarIcon">
          <Link to="/profile">
            <AccountProfileIcon />
          </Link>
        </div>
        <div className="navBarIcon">
          <Link to="/cart">
            <CartIcon />
          </Link>
        </div>
        <div className="navBarIcon">
          {localStorage.getItem("shopName") ? (
            <Link to="/shophome">Shop</Link>
          ) : (
            <Link to="/createShop">
              <ShopIcon />
            </Link>
          )}
        </div>

        <div className="navBarIcon">
          <Link to="/purchases">
            <OrderIcon />
          </Link>
        </div>

        <div className="navBarIcon" onClick={logout}>
          <LogoutIcon />
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return { items: state.items };
};

function mapDispatchToProps(dispatch) {
  return {
    setItems: (items) => dispatch(setItems(items)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
