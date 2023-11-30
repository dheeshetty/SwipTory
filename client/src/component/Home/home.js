
import React, { useState, useEffect } from "react";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import category from "./data";
import styles from "./Style.module.css";
import { ToastContainer, toast } from "react-toastify";
import loadingbar from "../../assets/loading.gif"
import { Link } from "react-router-dom";
import Storybyuser from "./storybyuser";
import { useNavigate } from "react-router";
import backend_url from "../../apis/api";

const Home = () => {
  const [categories, setCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showMore, setShowMore] = useState({});
  const [slideByUser, setSlideByUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const isLoggedIn = !!localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    async function fetchCategories() {
      try {
        const response = await axios.get(`${backend_url}/api/story/categories`);

        setCategories(response.data.categories);
        setIsLoading(false);
      } catch (error) {
        toast("Error in fetching stories", error);
      }
    }

    fetchCategories();
    async function fetchStoriesByUser() {
      const jwtToken = localStorage.getItem("token");
      try {
        const response = await axios.get(`${backend_url}/api/story/storiesbyuser`, {
          headers: {
            Authorization: jwtToken,
          },
        });
    
        // Check if userStories exists in the response and is an array
        if (response.data && Array.isArray(response.data.userStories)) {
          const slideIdArray = response.data.userStories
            .flatMap((story) => (story.slides || []).map((item) => item._id));
          setSlideByUser(slideIdArray);
        } else {
          console.error("Invalid userStories data in response:", response.data);
          // Handle the case where userStories is not as expected
        }
      } catch (error) {
        console.error("Error in fetching stories by user:", error);
        toast("Error in fetching stories by user", error);
      }
    }
    
    const isUserLoggedIn = !!localStorage.getItem("token");
    if (isUserLoggedIn) {
      fetchStoriesByUser();
    }
  }, []);

  const handleSeeMore = (categoryName) => {
    setShowMore((prevState) => ({
      ...prevState,
      [categoryName]: !prevState[categoryName],
    }));
  };

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
  };
  const [storyCardData, setStoryCardData] = useState();
  const handleSlide = async (storySlideId, slideCategoryName) => {
    const slidesByCategory = await categories[slideCategoryName].flatMap(
      (storiesArray) => storiesArray
    );
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
      <div className={styles.homeContainer}>
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
        <div className={styles.categoryContainer}>
          <div
            className={styles.categoryBox}
            onClick={() => setSelectedCategory("All")}
            style={
              selectedCategory === "All" ? { border: "5px solid #00ACD2" } : {}
            }
          >
            <h1 className={styles.categoryName}>All</h1>
          </div>
          {category.map((data, index) => (
            <div
              key={index}
              className={styles.categoryBox}
              style={{
                backgroundImage: `url(${data.image})`,
                border:
                  selectedCategory === data.category ? "5px solid #00ACD2" : "",
              }}
              onClick={() => handleCategoryClick(data.category)}
            >
              <h1 className={styles.categoryName}>{data.category}</h1>
            </div>
          ))}
        </div>
        {isLoading ? (
          <img
            src={loadingbar}
            alt="loadingbar"
            className={styles.loadingbar}
          />
        ) : (
          <div className={styles.storiesContainer}>
            {!isLoggedIn || selectedCategory !== "All" ? "" : <Storybyuser />}

            {selectedCategory === "All" ? (
              Object.keys(categories).map((categoryName, index) => (
                <React.Fragment key={index}>
                  <h2 className={styles.categoryTitle}>
                    Top stories about {categoryName}
                  </h2>
                  <div className={styles.storyBox}>
                    {categories[categoryName]
                      .flatMap((storiesArray) => storiesArray)
                      .slice(0, showMore[categoryName] ? undefined : 4)
                      .map((story, storyIndex) => (
                        <div key={storyIndex} className={styles.storyCard}>
                          <img
                            src={story.slideImageUrl}
                            alt="storypic"
                            onClick={() => handleSlide(story._id, categoryName)}
                          />
                          <div
                            className={styles.darkShadow}
                            onClick={() => handleSlide(story._id, categoryName)}
                          >
                            <div className={styles.storyTitle}>
                              {story.slideHeading}
                            </div>
                            <div className={styles.storyDescription}>
                              {story.slideDescription
                                .split(" ")
                                .slice(0, 16)
                                .join(" ") + "..."}
                            </div>
                          </div>

                          {slideByUser.includes(story._id) ? (
                            <Link to={`/editstory/${story._id}`}>
                              <button className={styles.editBtn}>
                                &#x270E;Edit
                              </button>
                            </Link>
                          ) : (
                            ""
                          )}
                        </div>
                      ))}
                  </div>

                  {categories[categoryName].flatMap((item) => item).length >
                    4 && (
                    <button
                      className={styles.seeMore}
                      onClick={() => handleSeeMore(categoryName)}
                    >
                      {showMore[categoryName] ? "See less" : "See more"}
                    </button>
                  )}
                </React.Fragment>
              ))
            ) : (
              <>
                <h2 className={styles.categoryTitle}>
                  Top stories about {selectedCategory}
                </h2>
                <div className={styles.storyBox}>
                  {categories[selectedCategory]
                    .flatMap((storiesArray) => storiesArray)
                    .slice(0, showMore[selectedCategory] ? undefined : 4)
                    .map((story, storyIndex) => (
                      <div key={storyIndex} className={styles.storyCard}>
                        <img
                          src={story.slideImageUrl}
                          alt="storypic"
                          onClick={() =>
                            handleSlide(story._id, selectedCategory)
                          }
                        />
                        <div
                          className={styles.darkShadow}
                          onClick={() =>
                            handleSlide(story._id, selectedCategory)
                          }
                        >
                          <div className={styles.storyTitle}>
                            {story.slideHeading}
                          </div>
                          <div className={styles.storyDescription}>
                            {story.slideDescription
                              .split(" ")
                              .slice(0, 16)
                              .join(" ") + "..."}
                          </div>
                        </div>
                        {slideByUser.includes(story._id) ? (
                          <Link to={`/editstory/${story._id}`}>
                            <button className={styles.editBtn}>
                              &#x270E;Edit
                            </button>
                          </Link>
                        ) : (
                          ""
                        )}
                      </div>
                    ))}
                </div>
                {Array.isArray(categories[selectedCategory]) &&
                  categories[selectedCategory].flatMap((item) => item).length >
                    4 && (
                    <button
                      className={styles.seeMore}
                      onClick={() => handleSeeMore(selectedCategory)}
                    >
                      {showMore[selectedCategory] ? "See less" : "See more"}
                    </button>
                  )}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;