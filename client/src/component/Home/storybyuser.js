import React, { useEffect, useState } from "react";
import "./home.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
const Storybyuser = () => {
  const [stories, setStories] = useState([]);
  const [visibleStories, setVisibleStories] = useState(4);
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchStoriesByUser() {
      try {
        const jwtToken = localStorage.getItem("token");
        const response = await axios.get(
          "https://swiptory-faqj.onrender.com//storiesbyuser",
          {
            headers: {
              Authorization: jwtToken,
            },
          }
        );
        setStories(response.data.userStories || []);
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    }

    fetchStoriesByUser();
  }, []);

  const handleSeeMore = () => {
    setVisibleStories(stories.length);
  };

  const handleSeeLess = () => {
    setVisibleStories(4);
  };

  return (
    <>
      <div className="stories-container">
        <h2 className="category-title">Your Stories</h2>
        <div className="story-box">
          {stories.slice(0, visibleStories).map((story, i) => (
            <div
              key={i}
              className="story-card"
              onClick={() => navigate(`/story/${story._id}`)}
            >
              <img src={story.slides[0].slideImageUrl} alt="foodpic" />
              <div className="dark-shadow">
                <h3 className="story-title">{story.slides[0].slideHeading}</h3>
                <h4 className="story-description">
                  {story.slides[0].slideDescription}
                </h4>
              </div>
              <Link to={`/editstory/${story._id}`}>
                <button className="edit-btn">&#x270E;Edit</button>
              </Link>
            </div>
          ))}
        </div>
        {stories.length > 4 && (
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
    </>
  );
};

export default Storybyuser;