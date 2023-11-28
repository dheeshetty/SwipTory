import React, { useState } from "react";
import "./login.css";
import cancel from "../../assets/cancel.svg";
import eyeOutline from "../../assets/eye.png";
import eyeOffOutline from "../../assets/hide.png";
import { useNavigate } from "react-router";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [error, setErrors] = useState();

  const [showPassword, setShowPassword] = useState(false);
  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setErrors("");
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "https://swiptory-faqj.onrender.com/login",
        loginData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const responseData = response.data;
      console.log(responseData);
      if (responseData.error) {
        setErrors(responseData.error);
      } else {
        window.localStorage.setItem("username", responseData.name);
        window.localStorage.setItem("token", responseData.jwtToken);
        // alert(responseData.success);

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
      <div className="login-container">
        <div className="login-box">
          <img
            src={cancel}
            alt="cancel icon"
            onClick={cancelButton}
            id="cancelBtn"
          />

          <div className="login-contentbox">
            <h2 className="login-h2">Login to SwipTory</h2>
            <label>
              Username
              <input
                type="text"
                placeholder="Enter username"
                name="username"
                onChange={handleChange}
                value={loginData.username}
              />
            </label>
            <label style={{ marginLeft: "6vw" }}>
              Password
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                name="password"
                onChange={handleChange}
                value={loginData.password}
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

            <button className="login-button" onClick={handleSubmit}>
              Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;