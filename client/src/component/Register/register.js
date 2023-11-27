import React, { useState } from "react";
import "./register.css";
import cancel from "../../assets/cancel.svg";
import eyeOutline from "../../assets/eye.png";
import eyeOffOutline from "../../assets/hide.png";
import { useNavigate } from "react-router";
import axios from "axios";
const Register = () => {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });
  const [error, setErrors] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
    setErrors("");
  };

  const dataSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://swiptory-faqj.onrender.com/register",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const responseData = await response.data;
      console.log(responseData);

      if (responseData.error) {
        setErrors(responseData.error);
      } else {
        window.localStorage.setItem("username", responseData.name);
        window.localStorage.setItem("token", responseData.jwtToken);
        alert(responseData.success);
        navigate("/");
      }
    } catch (error) {
      alert("something went wrong, please try again");
    }
  };

  const cancelButton = () => {
    navigate("/");
  };
  return (
    <>
      <div className="register-container">
        <div className="register-box">
          <img src={cancel} alt="cancel icon" onClick={cancelButton} />

          <div className="register-contentbox">
            <h2 className="login-h2">Register to SwipTory</h2>
            <label>
              Username
              <input
                type="text"
                placeholder="Enter username"
                name="username"
                onChange={handleChange}
                value={userData.username}
              />
            </label>
            <label style={{ marginLeft: "6vw" }}>
              Password
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                name="password"
                onChange={handleChange}
                value={userData.password}
              />
              {showPassword ? (
                <img
                  src={eyeOffOutline}
                  alt="Hide Password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="eye-icon"
                />
              ) : (
                <img
                  src={eyeOutline}
                  alt="Show Password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="eye-icon"
                />
              )}
            </label>
            <p style={{ color: "red" }}>{error && <span> {error}</span>}</p>

            <button className="register-button" onClick={dataSubmit}>
              Register
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;