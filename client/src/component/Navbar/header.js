import React, { useState } from "react";
import "./header.css";
import profileIcon from "../../assets/avatar.png";
import menuIcon from "../../assets/menu-icon.svg";
import bookmarkIcon from "./../../assets/Vector.svg";
import cross from "./../../assets/cross.svg";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const viewport = window.innerWidth;
  console.log(viewport);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.reload();
    navigate("/");
  };

  const [isProfileCardOpen, setProfileCardOpen] = useState(false);

  const toggleProfileCard = () => {
    setProfileCardOpen(!isProfileCardOpen);
  };

  return (
    <>
    <div className="navbar-container">
      <div className="page-title" onClick={() => navigate("/")}>
        SwipTory
      </div>
      {viewport > 600 ? (
        <div className="navbar-btns">
          {!isLoggedIn ? (
            <>
              <button
                className="register-btn"
                onClick={() => navigate("/register")}
              >
                Register Now
              </button>
              <button
                className="signin-btn"
                onClick={() => navigate("/login")}
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              <Link to="/bookmarked" style={{ textDecoration: "none" }}>
                <button className="bookmarks-btn">
                  <img src={bookmarkIcon} alt="" /> &nbsp; Bookmarks
                </button>
              </Link>
              <button
                className="bookmarks-btn"
                onClick={() => navigate("/addstory")}
              >
                Add Story
              </button>
              <img
                src={profileIcon}
                alt="profile-icon"
                className="profile-icon"
              />
              <img
                src={menuIcon}
                alt="menu-icon"
                className="menu-icon"
                onClick={toggleProfileCard}
              />
              {isProfileCardOpen && (
                <div className="profile-card">
                  <img
                    src={cross}
                    alt="cancel btn"
                    onClick={toggleProfileCard}
                  />
                  <h1 className="username">{username}</h1>
                  <button className="logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="mobileview">
          <img
            src={menuIcon}
            alt="menu-icon"
            className="menu-icon"
            onClick={toggleProfileCard}
          />
          {isProfileCardOpen && (
            <div className="profile-card">
              <img
                src={cross}
                alt="cancel btn"
                onClick={toggleProfileCard}
                id="crossBtn"
              />
              <div className="profile-contentbox">
                {!isLoggedIn ? (
                  <>
                    <button
                      className="register-btn"
                      onClick={() => navigate("/register")}
                    >
                      Register Now
                    </button>
                    <button
                      className="signin-btn"
                      onClick={() => navigate("/login")}
                    >
                      Sign in
                    </button>
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        display: "flex",
                        gap: "40px",
                        marginRight: "100px",
                      }}
                    >
                      <img
                        src={profileIcon}
                        alt="profile-icon"
                        className="profile-icon"
                      />
                      <h1 className="username">{username}</h1>
                    </div>
                    <Link to="/bookmarked" style={{ textDecoration: "none" }}>
                      <button className="bookmarks-btn">
                        <img src={bookmarkIcon} alt="" /> &nbsp; Bookmarks
                      </button>
                    </Link>
                    <button
                      className="bookmarks-btn"
                      onClick={() => navigate("/addstory")}
                      style={{ paddingLeft: "40px" }}
                    >
                      Add Story
                    </button>
                    <button className="logout-btn" onClick={handleLogout}>
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  </>
);
};

export default Header;