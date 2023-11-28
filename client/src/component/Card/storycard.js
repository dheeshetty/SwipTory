import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProgressBar from "./progress";
import "./storycard.css";
import previousStoryBtn from "../../assets/prev_ltr.svg";
import nextStoryBtn from "../../assets/next-ltr.svg";
import bookmarkedIcon from "../../assets/bkicon.svg";
import likedIcon from "../../assets/likes.svg";
import shareIcon from "../../assets/shareicon.svg";
import cancelIcon from "../../assets/storycross.svg";


const StoryCard = () => {
  const [story, setStory] = useState(null);
  const { id } = useParams();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const navigate = useNavigate();
  const [likesCount, setLikesCount] = useState(0);
  const [showLinkShareBar, setShowLinkShareBar] = useState(false);
  const [enableAutoSlideChange, setEnableAutoSlideChange] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef(null);

  useEffect(() => {
    axios
      .get(`https://swiptory-faqj.onrender.com/${id}`)
      .then((response) => {
        setStory(response.data.story.slides);
      })
      .catch((error) => {
        console.error("Error fetching story:", error);
      });
  }, [id]);

  useEffect(() => {
    const checkLoginStatus = () => {
      const jwtToken = localStorage.getItem("token");
      setIsLoggedIn(!!jwtToken);
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 100 / (story?.length || 1);
        if (newProgress >= 100) {
          clearInterval(progressInterval.current);
          setTimeout(() => {
            setProgress(0);
          }, 10000);
        }
        return newProgress;
      });
    };

    if (enableAutoSlideChange && currentSlideIndex < (story?.length || 1) - 1) {
      progressInterval.current = setInterval(
        updateProgress,
        10000 / (story?.length || 1)
      );
    } else {
      clearInterval(progressInterval.current);
      setProgress(0);
    }

    return () => {
      clearInterval(progressInterval.current);
    };
  }, [currentSlideIndex, enableAutoSlideChange, story]);

  const handleNextSlide = () => {
    setEnableAutoSlideChange(false);
    setCurrentSlideIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % story.length;
      return newIndex !== 0 ? newIndex : prevIndex;
    });

    setTimeout(() => {
      setEnableAutoSlideChange(true);
    }, 10000);
  };

  const handlePreviousSlide = () => {
    setEnableAutoSlideChange(false);
    setCurrentSlideIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? story.length - 1 : prevIndex - 1;
      return newIndex !== story.length - 1 ? newIndex : prevIndex;
    });

    setTimeout(() => {
      setEnableAutoSlideChange(true);
    }, 10000);
  };

  const handleShare = () => {
    const currentSlideId = story[currentSlideIndex]._id;
    const baseLink = process.env.REACT_APP_BASE_URL || "http://localhost:3000";
    const linkToCopy = `${baseLink}/story/${currentSlideId}`;

    navigator.clipboard.writeText(linkToCopy).then(() => {
      setShowLinkShareBar(true);
    });
  };

  useEffect(() => {
    if (showLinkShareBar) {
      const timeout = setTimeout(() => {
        setShowLinkShareBar(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [showLinkShareBar]);

  const handleBookmark = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    try {
      const currentSlideId = story[currentSlideIndex]._id;
      const jwtToken = localStorage.getItem("token");
      const response = await axios.post(
        `https://swiptory-faqj.onrender.com/${currentSlideId}/bookmark`,
        null,
        {
          headers: {
            Authorization: jwtToken,
          },
        }
      );

      if (response.status === 200) {
        toast("Story bookmarked successfully");
      }
    } catch (error) {
      console.error("Error bookmarking the story:", error);
    }
  };

  const handleLiked = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    try {
      const currentSlideId = story[currentSlideIndex]._id;
      const jwtToken = localStorage.getItem("token");
      const response = await axios.post(
        `https://swiptory-faqj.onrender.com/${currentSlideId}`,
        null,
        {
          headers: {
            Authorization: jwtToken,
          },
        }
      );
      const likes = await axios.get(
        `https://swiptory-faqj.onrender.com/${currentSlideId}/isliked`
      );

      if (response.status === 200) {
        setLikesCount(likes.data.likes);
        toast("Story liked successfully");
      }
    } catch (error) {
      console.error("Error liking the story:", error);
    }
  };

  if (!story || story.length === 0) {
    return <div>Loading...</div>;
  }

  const currentSlide = story[currentSlideIndex];
  const progressBarSegments = story.length;
  const isLastSlide = currentSlideIndex === story.length - 1;

  return (
    <>
      <div className="story-container">
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
        <div className="storycard-box">
          <img
            src={previousStoryBtn}
            alt="backbutton"
            onClick={handlePreviousSlide} 
            id="previous-btn"
            className={currentSlideIndex === 0 ? "disabled-btn" : "enabled-btn"}
          />
          <div className="storycard">
            <div className="upper-darkshade">
              <ProgressBar
                progress={progress}
                maxProgress={100}
                intervalTime={10000}
                segments={progressBarSegments}
              />
              <div>
                <img
                  src={cancelIcon}
                  alt="cancelbutton"
                  onClick={() => navigate("/")}
                />
                <img
                  src={shareIcon}
                  alt="sharebutton"
                  className="sharebtn"
                  onClick={handleShare}
                />
              </div>
            </div>
            <img
              src={currentSlide.slideImageUrl}
              alt=""
              className="story-img"
            />
            {showLinkShareBar && (
              <div className="link-sharebar">Link copied to clipboard</div>
            )}
            <div className="lower-darkshade">
              <div className="story-title">{currentSlide.slideHeading}</div>
              <div className="story-description">
                {currentSlide.slideDescription}
              </div>
              <div className="bookmarks-likes-container">
                {isLoggedIn && (
                  <>
                    <div onClick={handleBookmark}>
                      <img
                        src={bookmarkedIcon}
                        alt="bookmarkicon"
                        className="bookmark-icon"
                      />
                    </div>
                    <div onClick={handleLiked}>
                      <img src={likedIcon} alt="like icon" />
                      <span>{likesCount}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <img
            src={nextStoryBtn}
            alt="nextbutton"
            onClick={handleNextSlide}
            id="next-btn"
            className={
              currentSlideIndex === story.length - 1
                ? "disabled-btn"
                : "enabled-btn"
            }
          />
        </div>
      </div>
    </>
  );
};

export default StoryCard;