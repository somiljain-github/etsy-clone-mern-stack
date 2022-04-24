import React, { useState, useEffect } from "react";
import axios from "axios";
import { constants } from "../config/config";
import "../styles/profile.css"
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import authHeader from "../services/authHeader";
// import { CountryDropdown } from "react-country-region-selector";

function Profile() {
  const navigate = useNavigate();

  const [details, setDetails] = useState({
    name: "",
    gender: "",
    city3: "",
    birth_month: "",
    birth_day: "",
    materials: "",
    bio: "",
    path: "",
  });
  const handleFieldChange = (event) => {
    console.log("here for handle change");
    setDetails(event.target.value);
    setDetails({
      ...details,
      [event.target.name]: event.target.value,
    });
  };

  const [value, setValue] = useState("");
  const changeHandler = (e) => {
    console.log(e);
    setValue(e);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("in the submit button");

    let dob = details.birth_month + "/" + details.birth_day;
    const userId = localStorage.getItem("userid");
    const data = {
      userid: userId,
      name: details.name,
      email: localStorage.getItem("email_id"),
      dob: dob,
      gender: details.gender,
      profilepicture: details.path,
      country: value,
      city: details.city3,
      address: details.materials,
      about: details.bio,
      phonenumber: "",
      currencyid: "",
      shopid: "",
    };
    console.log(data);
    axios
      .put(
        `http://${constants.IP.ipAddress}:3001/userProfile/${userId}`,
        data,
        {
          headers: authHeader(),
        }
      )
      .then((response) => {
        console.log(response.data);
        const result = alert("Profile Updated!!");
        navigate("/home", { replace: true });
        // setDetails(response.data.user);
      })
      .catch((err) => {
        console.log("error in getting all items in the home page");
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/", { replace: true });
    }
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userid");
    axios
      .get(`http://${constants.IP.ipAddress}:3001/userProfile/${userId}`, {
        headers: authHeader(),
      })
      .then((response) => {
        console.log(response.data.user);
        let dob1 = [];
        if (response.data.user.dob !== null) {
          dob1 = response.data.user.dob.split("/");
        }

        setDetails({
          ...details,
          bio: response.data.user.about,
          city3: response.data.user.city,
          gender: response.data.user.gender,
          name: response.data.user.name,
          path: response.data.user.profilepicture,
          birth_month: dob1[0],
          birth_day: dob1[1],
          materials: response.data.user.address,
        });

        setValue(response.data.user.country);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const fileSelector = async (e) => {
    e.preventDefault();
    let data = new FormData();
    data.append("file", e.target.files[0], e.target.files[0].name);
    console.log(e.target.files[0]);
    console.log(data);
    const test = await axios
      .post(`http://${constants.IP.ipAddress}:3001/update`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        setDetails({
          ...details,
          path: response.data.Location,
        });
        console.log(details.path);
      })
      .catch((err) => {
        console.log("err");
      });
  };

  return (
    <div style={{ margin: "auto" }}>
      <Navbar />
      <div id="DIV_1">
        <div id="DIV_2">
          <h1 id="H1_3">Your Public Profile</h1>
          {/* <p id="P_4">Everything on this page can be seen by anyone</p>{" "} */}
        </div>
        <form onSubmit={handleSubmit} id="FORM_6">
          <div id="DIV_7">
            <div id="DIV_8">
              <div id="DIV_9">
                <label htmlFor="avatar" id="LABEL_10">
                  Profile Picture
                </label>
                <div id="DIV_11">
                  <input
                    type="file"
                    id="INPUT_12"
                    name="avatar"
                    size="15"
                    onChange={fileSelector}
                  />
                  <div id="DIV_13">
                    <a id="A_14">
                      <img
                        id="IMG_15"
                        // src="https://www.etsy.com/images/avatars/default_avatar_400x400.png"
                        src={details.path}
                        alt="Somil"
                      />
                    </a>
                  </div>
                </div>
                <span id="SPAN_16">
                  Must be a .jpg, .gif or .png file smaller than 10MB and at
                  least 400px by 400px.
                </span>
              </div>
              <hr id="HR_17" />
              <div id="DIV_36">
                <label htmlFor="city3" id="LABEL_37">
                  Name
                </label>
                <div id="DIV_38">
                  <input
                    type="text"
                    name="name"
                    value={details.name}
                    onChange={handleFieldChange}
                    id="INPUT_39"
                  />
                </div>
              </div>
              <hr id="HR_22" />
              <div id="DIV_23">
                <label id="LABEL_24">Gender</label>
                <div id="DIV_25">
                  <input
                    type="radio"
                    value="female"
                    name="gender"
                    id="INPUT_26"
                    checked={details.gender === "female"}
                    onChange={handleFieldChange}
                  />
                  <label htmlFor="female" id="LABEL_27">
                    Female
                  </label>
                  <input
                    type="radio"
                    value="male"
                    name="gender"
                    id="INPUT_28"
                    checked={details.gender === "male"}
                    onChange={handleFieldChange}
                  />
                  <label htmlFor="male" id="LABEL_29">
                    Male
                  </label>
                  <input
                    type="radio"
                    value="private"
                    name="gender"
                    id="INPUT_30"
                    checked={details.gender === "private"}
                    onChange={handleFieldChange}
                  />
                  <label htmlFor="private" id="LABEL_31">
                    Rather not say
                  </label>
                </div>
              </div>
              <hr id="HR_35" />
              <div id="DIV_36">
                <label htmlFor="city3" id="LABEL_37">
                  City
                </label>
                <div id="DIV_38">
                  <input
                    type="text"
                    name="city3"
                    id="INPUT_39"
                    value={details.city3}
                    onChange={handleFieldChange}
                  />
                </div>
              </div>
              <hr id="HR_49" />
              <div id="DIV_50">
                <label id="LABEL_51">Birthday</label>{" "}
                <span id="SPAN_52">
                  <select
                    id="SELECT_53"
                    value={details.birth_month}
                    name="birth_month"
                    onChange={handleFieldChange}
                  >
                    <option id="OPTION_54">- month -</option>
                    <option value="1" id="OPTION_55">
                      January
                    </option>
                    <option value="2" id="OPTION_56">
                      February
                    </option>
                    <option value="3" id="OPTION_57">
                      March
                    </option>
                    <option value="4" id="OPTION_58">
                      April
                    </option>
                    <option value="5" id="OPTION_59">
                      May
                    </option>
                    <option value="6" id="OPTION_60">
                      June
                    </option>
                    <option value="7" id="OPTION_61">
                      July
                    </option>
                    <option value="8" id="OPTION_62">
                      August
                    </option>
                    <option value="9" id="OPTION_63">
                      September
                    </option>
                    <option value="10" id="OPTION_64">
                      October
                    </option>
                    <option value="11" id="OPTION_65">
                      November
                    </option>
                    <option value="12" id="OPTION_66">
                      December
                    </option>
                  </select>
                  <select
                    id="SELECT_67"
                    value={details.birth_day}
                    name="birth_day"
                    onChange={handleFieldChange}
                  >
                    <option id="OPTION_68">- day -</option>
                    <option value="1" id="OPTION_69">
                      1
                    </option>
                    <option value="2" id="OPTION_70">
                      2
                    </option>
                    <option value="3" id="OPTION_71">
                      3
                    </option>
                    <option value="4" id="OPTION_72">
                      4
                    </option>
                    <option value="5" id="OPTION_73">
                      5
                    </option>
                    <option value="6" id="OPTION_74">
                      6
                    </option>
                    <option value="7" id="OPTION_75">
                      7
                    </option>
                    <option value="8" id="OPTION_76">
                      8
                    </option>
                    <option value="9" id="OPTION_77">
                      9
                    </option>
                    <option value="10" id="OPTION_78">
                      10
                    </option>
                    <option value="11" id="OPTION_79">
                      11
                    </option>
                    <option value="12" id="OPTION_80">
                      12
                    </option>
                    <option value="13" id="OPTION_81">
                      13
                    </option>
                    <option value="14" id="OPTION_82">
                      14
                    </option>
                    <option value="15" id="OPTION_83">
                      15
                    </option>
                    <option value="16" id="OPTION_84">
                      16
                    </option>
                    <option value="17" id="OPTION_85">
                      17
                    </option>
                    <option value="18" id="OPTION_86">
                      18
                    </option>
                    <option value="19" id="OPTION_87">
                      19
                    </option>
                    <option value="20" id="OPTION_88">
                      20
                    </option>
                    <option value="21" id="OPTION_89">
                      21
                    </option>
                    <option value="22" id="OPTION_90">
                      22
                    </option>
                    <option value="23" id="OPTION_91">
                      23
                    </option>
                    <option value="24" id="OPTION_92">
                      24
                    </option>
                    <option value="25" id="OPTION_93">
                      25
                    </option>
                    <option value="26" id="OPTION_94">
                      26
                    </option>
                    <option value="27" id="OPTION_95">
                      27
                    </option>
                    <option value="28" id="OPTION_96">
                      28
                    </option>
                    <option value="29" id="OPTION_97">
                      29
                    </option>
                    <option value="30" id="OPTION_98">
                      30
                    </option>
                    <option value="31" id="OPTION_99">
                      31
                    </option>
                  </select>
                </span>
              </div>
              <hr id="HR_101" />
              <div id="DIV_102">
                <label htmlFor="bio" id="LABEL_103">
                  About
                </label>
                <textarea
                  name="bio"
                  id="TEXTAREA_104"
                  value={details.bio}
                  onChange={handleFieldChange}
                ></textarea>
                <p id="P_105">
                  <span id="SPAN_106">
                    Tell people a little about yourself.
                  </span>
                </p>
              </div>
              <hr id="HR_108" />
              <div id="DIV_109">
                <label htmlFor="materials" id="LABEL_110">
                  Address
                </label>
                <textarea
                  cols="50"
                  rows="2"
                  name="materials"
                  id="TEXTAREA_111"
                  value={details.materials}
                  onChange={handleFieldChange}
                ></textarea>
              </div>
              <hr id="HR_117" />
              <div id="DIV_118">
                {/* <Select options={options} name="country" value={value} onChange={changeHandler} /> */}
                {/* <CountryDropdown
                  className="form-control"
                  value={value}
                  onChange={changeHandler}
                /> */}
              </div>
            </div>
          </div>

          <div id="DIV_132">
            <input type="submit" value="Save Changes" id="INPUT_133" />
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
