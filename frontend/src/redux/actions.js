import { LOG_IN, LOG_OUT, SET_ITEMS, GET_CURRENCIES } from "./action-types.js";
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
