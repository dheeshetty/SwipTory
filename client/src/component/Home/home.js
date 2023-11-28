
import React, { useState, useEffect } from "react";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import category from "./data";
import "./home.css";
import Storybyuser from "./storybyuser";
import { useNavigate } from "react-router";

const Home = () => {
  const [categories, setCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showMore, setShowMore] = useState({});
  const [storybycategory, setStoryByCategory] = useState({});
  const isLoggedIn = !!localStorage.getItem("token");
  const navigate = useNavigate();
  console.log(categories);
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get(
          "https://swiptory-faqj.onrender.com/categories"
        );

        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    fetchCategories();
  }, []);
  const fetchStoriesByCategory = async (categoryName) => {
    try {
      const response = await axios.get(
        `https://swiptory-faqj.onrender.com/stories/${categoryName}`
      );
      const stories = response.data;
      setStoryByCategory(stories);
    } catch (error) {
      console.error(
        `Error fetching stories for category '${categoryName}':`,
        error
      );
    }
  };

  const handleSeeMore = (categoryName) => {
    setShowMore((prevState) => ({
      ...prevState,
      [categoryName]: !prevState[categoryName],
    }));
  };
  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    fetchStoriesByCategory(categoryName);
  };

  return (
    <>
      <div className="home-container">
        <div className="category-container">
          <div
            className="category-box"
            onClick={() => {
              setSelectedCategory("All");
            }}
            style={
              selectedCategory === "All" ? { border: "5px solid #00ACD2" } : {}
            }
          >
            <h1 className="category-name">All</h1>
          </div>
          {category.map((data, index) => (
            <div
              key={index}
              className="category-box"
              style={{
                backgroundImage: `url(${data.image})`,
                border:
                  selectedCategory === data.category ? "5px solid #00ACD2" : "",
              }}
              onClick={() => handleCategoryClick(data.category)}
            >
              <h1 className="category-name">{data.category}</h1>
            </div>
          ))}
        </div>
        <div className="stories-container">
          {!isLoggedIn || selectedCategory !== "All" ? "" : <Storybyuser />}

          {selectedCategory === "All" ? (
            Object.keys(categories).map((categoryName, index) => (
              <>
                <h2 key={index} className="category-title">
                  Top stories about {categoryName}
                </h2>
                <div className="story-box">
                  {categories[categoryName]
                    ?.slice(
                      0,
                      showMore[categoryName]
                        ? categories[categoryName].length
                        : 4
                    )
                    .map((storiesArray, innerIndex) => (
                      <div
                        key={innerIndex}
                        className="story-card"
                        onClick={() =>
                          navigate(`/story/${storiesArray[0]._id}`)
                        }
                      >
                        <img
                          src={storiesArray[0].slideImageUrl}
                          alt="storypic"
                        />
                        <div className="dark-shadow">
                          <h3 className="story-title">
                            {storiesArray[0].slideHeading}
                          </h3>
                          <h4 className="story-description">
                            {storiesArray[0].slideDescription
                              .split(" ")
                              .slice(0, 16)
                              .join(" ") + "..."}
                          </h4>
                        </div>
                      </div>
                    ))}
                </div>
                {categories[categoryName].length > 4 && (
                  <button
                    className="see-more"
                    onClick={() => handleSeeMore(categoryName)}
                  >
                    {showMore[categoryName] ? "See less" : "See more"}
                  </button>
                )}
              </>
            ))
          ) : (
            <>
              <h2 className="category-title">
                Top stories about {selectedCategory}
              </h2>
              <div className="story-box">
                {categories[selectedCategory]
                  ?.slice(
                    0,
                    showMore[selectedCategory]
                      ? categories[selectedCategory].length
                      : 4
                  )
                  .map((storiesArray, index) => (
                    <div
                      key={index}
                      className="story-card"
                      onClick={() => navigate(`/story/${storiesArray[0]._id}`)}
                    >
                      <img src={storiesArray[0].slideImageUrl} alt="foodpic" />
                      <div className="dark-shadow">
                        <h3 className="story-title">
                          {storiesArray[0].slideHeading}
                        </h3>
                        <h4 className="story-description">
                          {storiesArray[0].slideDescription
                            .split(" ")
                            .slice(0, 16)
                            .join(" ") + "..."}
                        </h4>
                      </div>
                    </div>
                  ))}
              </div>
              {Array.isArray(categories[selectedCategory]) &&
                categories[selectedCategory].length > 4 && (
                  <button
                    className="see-more"
                    onClick={() => handleSeeMore(selectedCategory)}
                  >
                    {showMore[selectedCategory] ? "See less" : "See more"}
                  </button>
                )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;