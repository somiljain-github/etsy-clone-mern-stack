import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import CreateShop from "./components/CreateShop";
import ShopHome from "./components/ShopHome";
import Profile from "./components/Profile";
import Favourites from "./components/Favourites";
import Item from "./components/Item";
import Cart from "./components/Cart";
import Purchases from "./components/Purchases";

function App() {
  return (
    <div className="App">
      {/* <BrowserRouter> */}
      <div className="App">
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/home" element={<Home />} />
          <Route exact path="/createshop" element={<CreateShop />} />
          <Route exact path="/shophome" element={<ShopHome />} />
          <Route exact path="/favourites" element={<Favourites />} />
          <Route exact path="/item/:itemID" element={<Item />} />
          <Route exact path="/cart" element={<Cart />} />
          <Route exact path="/purchases" element={<Purchases />} />
          
          <Route exact element={Error} />
        </Routes>
      </div>
      {/* </BrowserRouter> */}
    </div>
  );
}

export default App;
