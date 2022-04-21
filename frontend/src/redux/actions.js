import { LOG_IN, LOG_OUT, SET_ITEMS } from "./action-types.js";
export function loginUser(payload) {
  console.log("Dispatching in addUser...");
  return { type: LOG_IN, payload };
}

export function logoutUser() {
  console.log("Dispatching in removeUser...");
  return { type: LOG_OUT };
}

export function setItems(items) {
  console.log("Setting the items in redux store...");
  return { type: SET_ITEMS, payload: items };
}
