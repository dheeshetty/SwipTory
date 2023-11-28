import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar/header";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loadingbar from "../../assets/loading.gif";

const Bookmark = () => {
  const [bookmarkedStories, setBookmarkedStories] = useState([]);
  const [visibleStories, setVisibleStories] = useState(4);
  const [isLoading, setIsLoading] = useState(false);
  const isLoggedIn = !!localStorage.getItem("token");
  const navigate = useNavigate();
  useEffect(() => {
    setIsLoading(true);
    const fetchBookmarkedStories = async () => {
      try {
        const jwtToken = localStorage.getItem("token");
        const response = await axios.get(
          "https://swiptory-faqj.onrender.com/bookmarks",
          {
            headers: {
              Authorization: jwtToken,
            },
          }
        );

        setBookmarkedStories(response.data || []);
        setIsLoading(false);
      } catch (error) {
        toast("Error fetching bookmarked stories:");
      }
    };

    fetchBookmarkedStories();
  }, []);

  const handleSeeMore = () => {
    setVisibleStories(bookmarkedStories.length);
  };

  const handleSeeLess = () => {
    setVisibleStories(4);
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {!isLoggedIn ? (
        <Link to="/"></Link>
      ) : (
        <div>
          <Navbar />
        {!isLoading ? (
          <div className="stories-container">
            <h2 className="category-title">Your Bookmarks</h2>
            <div className="story-box">
              {bookmarkedStories.slice(0, visibleStories).map((story, i) => (
                <div
                  key={i}
                  className="story-card"
                  onClick={() => navigate(`/story/${story._id}`)}
                >
                  <img src={story.slideImageUrl} alt="foodpic" />
                  <div className="dark-shadow">
                    <h3 className="story-title">{story.slideHeading}</h3>
                    <h4 className="story-description">
                      {story.slideDescription}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
            {bookmarkedStories.length > 4 && (
              <div className="see-more-less">
                {visibleStories === 4 ? (
                  <button onClick={handleSeeMore} className="see-more">
                    See more
                  </button>
                ) : (
                  <button onClick={handleSeeLess} className="see-more">
                    See less
                  </button>
                )}
              </div>
            )}
          </div>
          ) : (
            <img
              src={loadingbar}
              alt="loadingbar"
              style={{ margin: "200px 580px" }}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Bookmark;