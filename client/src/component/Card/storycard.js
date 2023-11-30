import React, { useState, useEffect} from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProgressBar from "./progress";
import styles from "./Style.module.css";
import previousStoryBtn from "../../assets/prev_ltr.svg";
import nextStoryBtn from "../../assets/next-ltr.svg";
import bookmarkedIcon from "../../assets/bkicon.svg";
import likedIcon from "../../assets/likes.svg";
import shareIcon from "../../assets/shareicon.svg";
import cancelIcon from "../../assets/storycross.svg";
import nonLikedIcon from "../../assets/nonLiked.svg";
import nonBookmarkIcon from "../../assets/nonBookmarked.svg"


const StoryCard = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [story, setStory] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [likesCount, setLikesCount] = useState(0);
  const [showLinkShareBar, setShowLinkShareBar] = useState(false);
  const [enableAutoSlideChange, setEnableAutoSlideChange] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [progress, setProgress] = useState(0);

  const [isLiked, setIsLiked] = useState();
  const [isBookmark, setIsBookmark] = useState();
  useEffect(() => {
    const storedData = localStorage.getItem("storyCardData");
    if (storedData) {
      try {
        const initialData = JSON.parse(storedData);
        setStory(initialData);
        const index = initialData.findIndex((slide) => slide._id === id);
        setCurrentSlideIndex(index);
      } catch (error) {
        alert("Error fetching data", error);
        navigate("/");
      }
    }

    const checkLoginStatus = () => {
      const jwtToken = localStorage.getItem("token");
      setIsLoggedIn(!!jwtToken);
    };

    checkLoginStatus();
  }, []);

  const handleSlideChange = (newIndex) => {
    setCurrentSlideIndex(newIndex);
    navigate(`/story/${story[newIndex]._id}`);
  };

  const handleNextSlide = () => {
    const newIndex = currentSlideIndex + 1;

    if (newIndex < story.length) {
      handleSlideChange(newIndex);
    }
  };

  const handlePreviousSlide = () => {
    const newIndex = currentSlideIndex - 1;

    if (newIndex >= 0) {
      handleSlideChange(newIndex);
    }
  };
  useEffect(() => {
    let currentProgress = 0;
    let increment = 100 / (10 * 30);

    const interval = setInterval(() => {
      currentProgress += increment;
      if (currentProgress > 100) {
        clearInterval(interval);
      } else {
        setProgress(currentProgress);
      }
    }, 33);

    return () => {
      clearInterval(interval);
    };
  }, [currentSlideIndex, enableAutoSlideChange]);
  useEffect(() => {
    let timeInterval;

    if (enableAutoSlideChange) {
      timeInterval = setInterval(() => {
        handleNextSlide();
      }, 10000);
    }
   
    return () => {
      clearInterval(timeInterval);
    };
  }, [currentSlideIndex, enableAutoSlideChange]);
  const handleShare = () => {
    const currentSlideId = story[currentSlideIndex]._id;
    const baseLink = process.env.REACT_APP_BASE_URL;
    const linkToCopy = `http://localhost:3000/story/${currentSlideId}`;

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
        `https://swiptory-faqj.onrender.com/api/story/bookmark/${currentSlideId}`,
        null,
        {
          headers: {
            Authorization: jwtToken,
          },
        }
      );

      if (response.data.message === "Story bookmarked successfully") {
        setIsBookmark(true);
        toast("Story bookmarked successfully");
      } else {
        setIsBookmark(false);
        toast(response.data.message);
      }
    } catch (error) {
      toast("Error bookmarking the story", error);
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
        `https://swiptory-faqj.onrender.com/api/story/like//${currentSlideId}`,
        null,
        {
          headers: {
            Authorization: jwtToken,
          },
        }
      );
      if (response.data.message === "Story liked successfully") {
        setIsLiked(true);
        setLikesCount(likesCount + 1);
        toast(response.data.message);
      } else {
        setIsLiked(false);
        setLikesCount(likesCount - 1);
        toast(response.data.message);
      }
    } catch (error) {
      toast("Error liking the story", error);
    }
  };
  useEffect(() => {
    const getUserBookmark = async () => {
      const jwtToken = localStorage.getItem("token");
      const response = await axios.get(
        `https://swiptory-faqj.onrender.com/api/story/bookmark/${id}/isBookmarked`,

        {
          headers: {
            Authorization: jwtToken,
          },
        }
      );

      setIsBookmark(response.data.isBookmarked);
    };
    getUserBookmark();
    const getUserLike = async () => {
      const jwtToken = localStorage.getItem("token");
      const response = await axios.get(
        `https://swiptory-faqj.onrender.com/api/story/like/${id}/isLiked`,

        {
          headers: {
            Authorization: jwtToken,
          },
        }
      );

      setIsLiked(response.data.isLiked);
    };
    getUserLike();
    const getSlideLikes = async () => {
      const likesResponse = await axios.get(
        `https://swiptory-faqj.onrender.com/api/story/like/${id}`
      );
      setLikesCount(likesResponse.data.likes);
    };
    getSlideLikes();
  }, [id]);
  if (!story || story.length === 0) {
    return (
      <img
        src="https://i.gifer.com/80ZN.gif"
        className={styles.loading}
        alt="Loading"
      />
    );
  }

  const currentSlide = story[currentSlideIndex];

  return (
    <div className={styles.storyContainer}>
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
      <div className={styles.storycardBox}>
        <img
          src={previousStoryBtn}
          alt="backbutton"
          onClick={handlePreviousSlide}
          id={styles.previousBtn}
          className={
            currentSlideIndex === 0 ? styles.disabledBtn : styles.enabledBtn
          }
        />
        <div className={styles.storycard}>
          <ProgressBar progress={progress} />
          <div className={styles.upperDarkshade}>
            <div>
              <img
                src={cancelIcon}
                alt="cancelbutton"
                onClick={() => navigate("/")}
              />
              <img
                src={shareIcon}
                alt="sharebutton"
                className={styles.sharebtn}
                onClick={handleShare}
              />
            </div>
          </div>
          <div className={styles.leftrightBtnBox}>
            <div className={styles.leftBtn} onClick={handlePreviousSlide}></div>
            <div className={styles.rightBtn} onClick={handleNextSlide}></div>
          </div>
          <img
            src={currentSlide.slideImageUrl}
            alt=""
            className={styles.storyImg}
          />
          {showLinkShareBar && (
            <div className={styles.linkSharebar}>Link copied to clipboard</div>
          )}
          <div className={styles.lowerDarkshade}>
            <div className={styles.storyTitle}>{currentSlide.slideHeading}</div>
            <div className={styles.storyDescription}>
              {currentSlide.slideDescription}
            </div>
            <div className={styles.bookmarksLikesContainer}>
              <div onClick={handleBookmark}>
                {isBookmark ? (
                  <img
                    src={bookmarkedIcon}
                    alt="bookmarkicon"
                    className={styles.bookmarkIcon}
                  />
                ) : (
                  <img
                    src={nonBookmarkIcon}
                    alt="bookmarkicon"
                    className={styles.bookmarkIcon}
                  />
                )}
              </div>
              <div onClick={handleLiked}>
                {isLiked ? (
                  <img src={likedIcon} alt="like icon" />
                ) : (
                  <img src={nonLikedIcon} alt="like icon" />
                )}
                <span>{likesCount}</span>
              </div>
            </div>
          </div>
        </div>
        <img
          src={nextStoryBtn}
          alt="nextbutton"
          onClick={handleNextSlide}
          id={styles.previousBtn}
          className={
            currentSlideIndex === story.length - 1
              ? styles.disabledBtn
              : styles.enabledBtn
          }
        />
      </div>
    </div>
  );
};

export default StoryCard;
