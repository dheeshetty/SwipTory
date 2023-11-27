import React, { useState } from "react";
import "./addstory.css";
import cancel from "../../assets/cancel.svg";
import { useNavigate } from "react-router";
import axios from "axios";

const AddStory = () => {
  const navigate = useNavigate();
  const [error, setErrors] = useState("");
  const initialSlide = {
    slideHeading: "",
    slideDescription: "",
    slideImageUrl: "",
    category: "",
  };

  const [currentSlide, SetCurrentSlide] = useState(0);
  const [story, setStory] = useState([initialSlide]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStory((prevState) => {
      const updatedSlides = prevState.map((slide, index) =>
        index === currentSlide ? { ...slide, [name]: value } : slide
      );
      setErrors("");
      return updatedSlides;
    });
  };

  const handleNextSlide = () => {
    if (currentSlide < story.length - 1) {
      SetCurrentSlide((prevIndex) => prevIndex + 1);
    }
  };

  const handlePreviousSlide = () => {
    if (currentSlide > 0) {
      SetCurrentSlide((prevIndex) => prevIndex - 1);
    }
  };

  const handlePostStory = async () => {
    try {
      const slides = story;

      const jwtToken = localStorage.getItem("token");

      const response = await axios.post(
        "https://swiptory-faqj.onrender.com/addstory",
        { slides },
        {
          headers: {
            Authorization: jwtToken,
          },
        }
      );

      if (response.data.error) {
        setErrors(response.data.error);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error adding story:", error.response.data);
    }
  };
  const handleAddSlide = () => {
    setErrors("");
    if (story.length < 6) {
      setStory((prevState) => [...prevState, initialSlide]);
      SetCurrentSlide(story.length);
    }
  };
  const cancelButton = () => {
    navigate("/");
  };
  return (
    <>
      <div className="addstory-container">
        <div className="addstory-box">
          <img src={cancel} alt="cancel-icon" onClick={cancelButton} />
          <div className="heading2">Add up to 6 slides</div>
          <div className="slide-btn-container">
            {story.map((_, index) => (
              <div
                key={index}
                className={`slide-btn ${
                  currentSlide === index ? "active" : ""
                }`}
              >
                Slide {index + 1}
              </div>
            ))}
            {story.length < 6 && (
              <div className="slide-btn" onClick={handleAddSlide}>
                Add +
              </div>
            )}
          </div>
          <div className="addstory-contentbox">
            <div>
              <label>Heading:</label>
              <input
                type="text"
                name="slideHeading"
                value={story[currentSlide].slideHeading}
                onChange={handleChange}
                placeholder="Your heading"
                className="addstory-input"
              />
            </div>
            <div>
              <label>Description:</label>
              <input
                type="text"
                name="slideDescription"
                value={story[currentSlide].slideDescription}
                onChange={handleChange}
                placeholder="Story description"
                className="addstory-input"
                style={{ height: "80px" }}
              />
            </div>
            <div>
              <label>Image:</label>
              <input
                type="text"
                name="slideImageUrl"
                value={story[currentSlide].slideImageUrl}
                onChange={handleChange}
                placeholder="Add image url"
                className="addstory-input"
              />
            </div>
            <div>
              <label>Category:</label>
              <select
                name="category"
                value={story[currentSlide].category}
                onChange={handleChange}
              >
                <option value="" defaultChecked>
                  Select Category
                </option>
                <option value="food">Food</option>
                <option value="health and fitness">Health and Fitness</option>
                <option value="travel">Travel</option>
                <option value="movies">Movies</option>
                <option value="education">Education</option>
              </select>
            </div>
          </div>
          <p style={{ color: "red", marginLeft: "5rem" }}>
            {error && <span> {error}</span>}
          </p>
          <div className="addstory-buttons-box">
            <div>
              <button className="previous-btn" onClick={handlePreviousSlide}>
                Previous
              </button>
              <button className="next-btn" onClick={handleNextSlide}>
                Next
              </button>
            </div>
            <button className="post-btn" onClick={handlePostStory}>
              Post
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddStory;