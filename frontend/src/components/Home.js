import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import { constants } from "../config/config";
import authHeader from "../services/authHeader";
import { useDispatch, useSelector } from "react-redux";
import { setItems } from "../redux/actions";
import HomeCardSingle from "./HomeCardSingle";
import Footer from "./Footer";

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((state) => state.items);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/", { replace: true });
    }
  }, []);

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

  const items_list_cards = items.map((item) => {
    // console.log("the item is ", item);
    let props = {
      name: item.name,
      price: item.price,
      displayPicture: item.displayPicture,
      itemID: item._id,
    };

    return <HomeCardSingle key={props.itemID} {...props} />;
  });

  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div>Home</div>
      <div>
        <main>
          <section className="cards">{items_list_cards}</section>
        </main>
      </div>
      <Footer />
    </div>
  );
}

// const mapStateToProps = (state) => {
//   return { items: state.items };
// };

// function mapDispatchToProps(dispatch) {
//   return {
//     setItems: (items) => dispatch(setItems(items)),
//   };
// }

// export default connect(mapStateToProps, mapDispatchToProps)(Home);
export default Home;
