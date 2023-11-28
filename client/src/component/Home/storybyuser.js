import React, { useEffect, useState } from "react";
import "./home.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import loadingbar from "../../assets/loading.gif"
import { useNavigate } from "react-router";
const Storybyuser = () => {
  const [stories, setStories] = useState([]);
  const [visibleSlides, setVisibleSlides] = useState(4);
  const [isLoading, setIsLoading] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    async function fetchStoriesByUser() {
      try {
        const jwtToken = localStorage.getItem("token");
        const response = await axios.get(
          "https://swiptory-faqj.onrender.com/storiesbyuser",
          {
            headers: {
              Authorization: jwtToken,
            },
          }
        );
        setStories(response.data.userStories || []);
        setIsLoading(false);
      } catch (error) {
        toast("Error in fetching your stories:", error);
      }
    }

    fetchStoriesByUser();
  }, []);

  const handleSeeMore = () => {
    setVisibleSlides(stories.flatMap((story) => story.slides).length);
  };

  const handleSeeLess = () => {
    setVisibleSlides(4);
  };
  const storyLength = stories.map((story) => story.slides).flat();

  return (
    <>
      <div className="stories-container">
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

        <h2 className="category-title">Your Stories</h2>
        {isLoading ? (
          <img src={loadingbar} alt="loadingbar" />
        ) : storyLength.length === 0 ? (
          <p style={{ fontSize: "1rem", fontWeight: "500" }}>
            Please add your new story.
          </p>
        ) : (
          <div className="story-box">
            {stories
              .flatMap((story) => story.slides)
              .slice(0, visibleSlides)
              .map((item, slideIndex) => (
                <div key={slideIndex} className="story-card">
                  <img
                    src={item.slideImageUrl}
                    alt="storypic"
                    onClick={() => navigate(`/story/${item._id}`)}
                  />
                  <div
                    className="dark-shadow"
                    onClick={() => navigate(`/story/${item._id}`)}
                  >
                    <h3 className="story-title">{item.slideHeading}</h3>
                    <div className="story-description">
                      {item.slideDescription.split(" ").slice(0, 16).join(" ") +
                        "..."}
                    </div>
                  </div>
                  <Link to={`/editstory/${item._id}`}>
                    <button className="edit-btn">&#x270E;Edit</button>
                  </Link>
                </div>
              ))}
          </div>
        )}

        <div className="see-more-less">
          {visibleSlides === 4 ? (
            <button onClick={handleSeeMore} className="see-more">
              See more
            </button>
          ) : (
            <button onClick={handleSeeLess} className="see-more">
              See less
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Storybyuser;