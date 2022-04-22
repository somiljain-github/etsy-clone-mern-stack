import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import { constants } from "../config/config";
import authHeader from "../services/authHeader";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { setItems } from "../redux/actions";
import HomeCardSingle from "./HomeCardSingle";
import Footer from "./Footer";
import Filter from "./Filter";


function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(((state) => state.items), shallowEqual);
  const [inStock,setInStock] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy,setSortBy] = useState("");
  const [itemsListCards, setItemListCards] = useState("");

  /* ----------------------------- check-for-token ---------------------------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/", { replace: true });
    }
  }, []);

  /* ------------------ first-useEffect-to-get-all-the-items ------------------ */
  useEffect(async () => {
    const userID = await localStorage.getItem("userID");
    let URL = `http://${constants.IP.ipAddress}:3001/api/v1/item/getAll/${userID}`;
    console.log("about to make the axios call from the home page to get all the items with the url as", URL);
    axios
      .get(URL, {headers: authHeader()})
      .then((response) => {
        console.log("made the call in the home page to get the items....")
        if (response.status === 200) {
          const temp_items = response.data;
          console.log("got the items in the home page and the items are", temp_items);
          dispatch(setItems(temp_items));
        } else if (response.data.code === 500) {
          console.log(response.data.message);
        } else{
          console.log("the api request to get items in the home page went fine but for some reason did not go well");
        }
      })
      .catch((err) => {
        console.log(
          "error in getting all items in the home page and the error is",
          err
        );
      });
  }, []);
  /* -------------------------- convert-items-to-jsx -------------------------- */
  useEffect(
    () => {
      setItemListCards(items.map((item) => {
        let props = { name: item.name, price: item.price, displayPicture: item.displayPicture, itemID: item._id,};
        return <HomeCardSingle key={props.itemID} {...props} />; 
      }) );
    }, [items]
  );
  /* ---------------------------- sorting-the-items --------------------------- */
  useEffect(
    () => {
          items.sort((a,b)=>{ return (a[sortBy] < b[sortBy]) ? 1 : -1 });
          setItemListCards(
            items.map((item) => {
              let props = { name: item.name, price: item.price, displayPicture: item.displayPicture, itemID: item._id,};
              return <HomeCardSingle key={props.itemID} {...props} />; 
            })
          );
    }, [sortBy]
  )
  /* --------------------------- Out-of-stock-filter -------------------------- */
  useEffect(
    () => {
      if(inStock){
        console.log("about to EXCLUDE out of stock items");
        setItemListCards(
          items.filter(item => item.quantity > 0).map((item) => {
            console.log(item.name, item.quantity);
            let props = { name: item.name, price: item.price, displayPicture: item.displayPicture, itemID: item._id };
            return <HomeCardSingle key={props.itemID} {...props} />;
          })
        );
      } else {
        console.log("about to INCLUDE out of stock items");
        setItemListCards(
          items.map((item) => {
            console.log(item.name, item.quantity);
            let props = { name: item.name, price: item.price, displayPicture: item.displayPicture, itemID: item._id };
            return <HomeCardSingle key={props.itemID} {...props} />;
          })
        );
      }
    }, [inStock]
  )
  /* --------------------- filter-component-filter-button --------------------- */
  const filterButton = async () => {
    console.log("The min and the max price are", minPrice, maxPrice);
    let URL = `http://${constants.IP.ipAddress}:3001/api/v1/item/filter?minPrice=${minPrice}&maxPrice=${maxPrice}`;
    console.log("calling the api to get items filtered by price range and the URL is", URL);
    axios.get(URL, { headers: authHeader() })
    .then(
      (response) => {
        const temp_items = response.data;
        dispatch(setItems(temp_items));
      }
    )
    .catch(
      (error) => {
        console.log("Had an error while getting the filtered items in the function filter_button and the error is", error);
      }
    );
  }
  /* ------------------------------ returning-jsx ----------------------------- */
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div>
        <Filter inStock={inStock} setInStock={setInStock} 
                minPrice={minPrice} setMinPrice={setMinPrice}
                maxPrice={maxPrice} setMaxPrice={setMaxPrice}
                sortBy={sortBy} setSortBy={setSortBy} 
                filterButton={filterButton}/>
      </div>
      <div>Home</div>
      <div>
        <main>
          <section className="cards">{itemsListCards}</section>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
