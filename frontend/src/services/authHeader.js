export default function authHeader() {
  const token = window.localStorage.getItem("token");
  if (token) {
    return { Authorization: "Bearer " + token };
  } else {
    console.log("in the authHeader.js file and cannot get the token");
    return {};
  }
}
