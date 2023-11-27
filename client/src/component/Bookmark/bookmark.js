import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar/header";
import { Link, useNavigate } from "react-router-dom";

const Bookmark = () => {
  const [bookmarkedStories, setBookmarkedStories] = useState([]);
  const [visibleStories, setVisibleStories] = useState(4);
  const isLoggedIn = !!localStorage.getItem("token");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchBookmarkedStories = async () => {
      try {
        const jwtToken = localStorage.getItem("token");
        const response = await axios.get(
          "https://swiptory-backend.onrender.com/api/bookmarks",
          {
            headers: {
              Authorization: jwtToken,
            },
          }
        );
        console.log(response.data);
        setBookmarkedStories(response.data || []);
      } catch (error) {
        console.error("Error fetching bookmarked stories:", error);
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
      {!isLoggedIn ? (
        <Link to="/"></Link>
      ) : (
        <div>
          <Navbar />
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
        </div>
      )}
    </>
  );
};

export default Bookmark;