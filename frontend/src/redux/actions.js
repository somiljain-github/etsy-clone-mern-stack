import { LOG_IN, LOG_OUT } from "./action-types.js";
export function loginUser(payload) {
  console.log("Dispatching in addUser...");
  return { type: LOG_IN, payload };
}

export function logoutUser() {
  console.log("Dispatching in removeUser...");
  return { type: LOG_OUT };
}
