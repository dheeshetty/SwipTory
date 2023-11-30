import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../Home/Style.module.css";
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
          `https://swiptory-faqj.onrender.com/api/story/bookmark/bookmarkedslides`,
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
  const [storyCardData, setStoryCardData] = useState();
  const handleSlide = async (storySlideId) => {
    const slidesByCategory = bookmarkedStories;
    setStoryCardData(slidesByCategory);
    setTimeout(() => {
      navigate(`/story/${storySlideId}`);
    }, 0);
  };
  useEffect(() => {
    localStorage.setItem("storyCardData", JSON.stringify(storyCardData));
  }, [storyCardData]);
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
            <div className={styles.storiesContainer}>
              <h2 className={styles.categoryTitle}>Your Bookmarks</h2>
              {bookmarkedStories.error === "No bookmarked slides found" ? (
                <p>No bookmarked story</p>
              ) : (
                <div className={styles.storyBox}>
                  {bookmarkedStories
                    .slice(0, visibleStories)
                    .map((story, i) => (
                      <div
                        key={i}
                        className={styles.storyCard}
                        onClick={() => handleSlide(story._id)}
                      >
                        <img src={story.slideImageUrl} alt="foodpic" />
                        <div className={styles.darkShadow}>
                          <h3 className={styles.storyTitle}>
                            {story.slideHeading}
                          </h3>
                          <h4 className={styles.storyDescription}>
                            {story.slideDescription
                              .split(" ")
                              .slice(0, 16)
                              .join(" ") + "..."}
                          </h4>
                        </div>
                      </div>
                    ))}
                </div>
              )}
              {bookmarkedStories.length > 4 && (
                <div className={styles.seeMoreLess}>
                  {visibleStories === 4 ? (
                    <button onClick={handleSeeMore} className={styles.seeMore}>
                      See more
                    </button>
                  ) : (
                    <button onClick={handleSeeLess} className={styles.seeMore}>
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
              className={styles.loadingbar}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Bookmark;
