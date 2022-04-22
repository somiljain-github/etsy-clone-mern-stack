import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { constants } from "../config/config";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/actions";

function Register({ user }) {
  const [loginDetails, setDetails] = useState({
    name: "",
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  const updateField = (e) => {
    setDetails({
      ...loginDetails,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home", { replace: true });
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      name: loginDetails.name,
      emailID: loginDetails.email,
      password: loginDetails.password,
    };
    console.log(data);
    axios
      .post(`http://${constants.IP.ipAddress}:3001/api/v1/register`, data)
      .then((response) => {
        if (response.data.status === 201) {
          const token = response.data.token;
          const emailID = response.data.user.emailID;
          const userid = response.data.user._id;
          window.localStorage.setItem("token", token);
          window.localStorage.setItem("emailID", emailID);
          window.localStorage.setItem("userID", userid);
          const userObj = { ...response.data.user, token: response.data.token };
          // console.log("--------the data is", userObj);
          dispatch(loginUser(userObj));
          navigate("/home");
        } else if (response.data.code === 400) {
          console.log(response.data.message);
          setMessage(response.data.message);
        }
      })
      .catch((err) => {
        setMessage(err.response.data.message);
      });
  };

  return (
    <div className="container">
      <div className="container mx-auto my-5 col-sm-4">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              className="form-control w-100"
              id="name"
              type="text"
              name="name"
              autoFocus
              required
              value={loginDetails.name}
              onChange={updateField}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              className="form-control w-100"
              id="email"
              type="text"
              name="email"
              autoFocus
              required
              value={loginDetails.email}
              onChange={updateField}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              className="form-control w-100"
              id="password"
              name="password"
              value={loginDetails.password}
              onChange={updateField}
              type="password"
              autoFocus
              required
            />
          </div>
          <div>
            <p>{message}</p>
          </div>
          <div className="row">
            <div className="mx-auto">
              <button className="btn btn-primary m-3" type="submit">
                Submit
              </button>
              <Link className="btn btn-primary width-size" to="/">
                Sign In
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// const mapStateToProps = (state) => {
//   return { user: state.user };
// };

// function mapDispatchToProps(dispatch) {
//   return {
//     loginUser: (user) => dispatch(loginUser(user)),
//   };
// }

// export default connect(mapStateToProps, mapDispatchToProps)(Register);
export default Register;
