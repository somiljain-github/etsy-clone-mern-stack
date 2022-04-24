import React, { useState, useEffect } from "react";
import { MDBCol, MDBContainer, MDBRow, MDBFooter } from "mdbreact";
import { Form } from "react-bootstrap";
import axios from "axios";
import { constants } from "../config/config";
import authHeader from "../services/authHeader";
import { useNavigate, Link } from "react-router-dom";
import "../styles/mainfooter.css";
import "bootstrap/dist/css/bootstrap.css";
import { useDispatch, useSelector } from "react-redux";
import { getCurrencies } from "../redux/actions";
import { loginUser } from "../redux/actions";

const Footer = ({ currency, setCurrency, countries, currencies }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userID = useSelector(state => state.user._id);
  const token = useSelector((state) => state.user.token);
  const currencies_list = useSelector(state => state.currencies);
  const country = useSelector(state=> state.user.country) || "United States";
  //   const [gettingCurrencies, setGettingCurrencies] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));


  useEffect(() => {
    let URL = `http://${constants.IP.ipAddress}:3001/api/v1/constants/currencies`;
    console.log(URL);
    axios.get(URL, {headers: authHeader()})
    .then(
        (response)=>{
          if(response.status == 200){
            const temp_currencies = response.data;
            console.log(temp_currencies);
            dispatch(getCurrencies(temp_currencies));
          }
        }
    ).catch(
      (err)=>{console.log("there was an error in gettng the currencies through the useEffect call during page refresh and the error is", err)}
    );
  }, []);
  //   const changeUserCurrency = async () => {
  //     if (currency && currency.id && currency.name) {
  //       const user = JSON.parse(localStorage.getItem("user"));
  //       const data = {};
  //       data.userId = user.id;
  //       data.currencyId = currency.id;
  //       try {
  // const response = await authapi.post(UPDATE_USER_CURRENCY, data);
  // if (response && response.data && response.data.success) {
  //   user.currency = currency.id;
  //   localStorage.setItem("user", JSON.stringify(user));
  // } else {
  //   setError("Some unexpected error occurred!");
  // }
  //       } catch (e) {
  //         console.log(e);
  //         setError("Some unexpected error occurred!");
  //       }
  //     }
  //   };

    const changeCurrency = (event) => {
    const data = {currencyID: event.target.value};
    let URL = `http://${constants.IP.ipAddress}:3001/api/v1/user/updatecurrency/${userID}`;
    console.log('making a call to update the currency with the url as.', URL, "and body as", data);
    axios.put(URL, data, {
      headers: authHeader(),
    }).
    then(
      (response)=>{
        if(response.data.status === '200'){
          console.log("all is good and the currency has been updated in the database. About to update the redux store now.");
          const userObj = response.data.user;
          dispatch(loginUser(userObj));
        } else {
          console.log("The response status is", response.status.toFixed, "and data is",response.data);
        }
      }
    ).
    catch(
      (error) => {
        console.log("There is an error in setting the currency and the error is", error);
      }
    );
    };

  return (
    <div className="main">
      <MDBFooter
        style={{ backgroundColor: "#232347", color: "white" }}
        className="font-small pt-4 mt-4"
      >
        <MDBContainer fluid className="text-center text-md-left">
          <MDBRow>
            <MDBCol md="4">
              <div></div>
            </MDBCol>
            <MDBCol md="4">
              <span>
              <Form.Group className="mb-3">
                <Form.Label className="currency-drpdwn-label">
                  Currency
                </Form.Label>
                <Form.Select
                  className="currency-drpdwn"
                  size="sm"
                  name="currency"
                  id="currency"
                  //   value={currency && currency.id}
                    onChange={changeCurrency}
                >
                  <option value="USD">Select Currency</option>
                  {currencies_list &&
                    currencies_list.length &&
                    currencies_list.map((eachCurrency, index) => {
                      return (
                        <option key={index} value={eachCurrency}>
                          {eachCurrency}
                        </option>
                      );
                    })}
                </Form.Select>
              </Form.Group>
              </span>
            </MDBCol>
            <MDBCol md="4">
              <MDBContainer>
                &copy; {new Date().getFullYear()} Copyright:{" "}
                <Link className="link__white" to="/home">Etsy</Link>
              </MDBContainer>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </MDBFooter>
    </div>
  );
};

export default Footer;
