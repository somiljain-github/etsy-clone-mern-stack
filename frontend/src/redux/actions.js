import { LOG_IN, LOG_OUT, SET_ITEMS, GET_CURRENCIES, UPDATE_SHOPNAME, UPDATE_CART } from "./action-types.js";
export function loginUser(payload) {
  console.log("Dispatching in addUser...");
  return { type: LOG_IN, payload };
}

export function logoutUser() {
  console.log("Dispatching in removeUser...");
  return { type: LOG_OUT };
}

export function setItems(items) {
  console.log("Setting the items in redux store... and the items are", items);
  return { type: SET_ITEMS, payload: items };
}

export function getCurrencies(currencies) {
  console.log(
    "Setting the currencies in redux store... and the currencies are",
    currencies
  );
  return { type: GET_CURRENCIES, payload: currencies };
}

export function updateShopName(shopName) {
  console.log("Setting the shopName in redux store... and the shopName is",shopName);
  return { type: UPDATE_SHOPNAME, payload: shopName };
}

export function updateCart(payload) {
  console.log("Setting the cart in redux store... and the cart is",payload);
  return { type: UPDATE_CART, payload };
}
