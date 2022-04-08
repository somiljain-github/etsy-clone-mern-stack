import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { constants } from "../config/config";
import { connect } from "react-redux";
import { loginUser } from "../redux/actions";

function Login({ user, loginUser }) {
  const [loginDetails, setDetails] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const updateField = (e) => {
    setDetails({
      ...loginDetails,
      [e.target.name]: e.target.value,
    });
  };

  const fetchToken = async () => {
    const token = await localStorage.getItem("token");
    if (token) navigate("/home", { replace: true });
  };

  useEffect(() => {
    fetchToken();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      emailID: loginDetails.email,
      password: loginDetails.password,
    };

    axios
      .post(`http://${constants.IP.ipAddress}:3001/api/v1/login`, data)
      .then((response) => {
        console.log(response.data);
        if (response.data.status === 201) {
          const token = response.data.token;
          const email_id = response.data.email_id;
          const userid = response.data.userid;

          if (response.data.shopid !== null) {
            const shopid = response.data.shopid;
            window.localStorage.setItem("shopid", shopid);
          }
          window.localStorage.setItem("token", token);
          window.localStorage.setItem("email_id", email_id);
          window.localStorage.setItem("userid", userid);

          // console.log(response.data);
          loginUser(response.data.email_id);
          navigate("/home");
        } else if (response.data.code === 400) {
          setMessage(response.data.message);
        }
      })
      .catch((err) => {
        console.log("error login");
      });
  };

  return (
    <div className="container">
      <div className="container mx-auto my-5 col-sm-4">
        <form onSubmit={handleSubmit}>
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

              <Link className="btn btn-primary width-size" to="/register">
                Register Now!
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
const mapStateToProps = (state) => {
  return { user: state.user };
};

function mapDispatchToProps(dispatch) {
  return {
    loginUser: (user) => dispatch(loginUser(user)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
