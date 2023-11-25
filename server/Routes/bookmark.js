const express = require("express");
const router = express.Router();
const Story = require("../Models/Stories");
const mongoose = require("mongoose");
const Bookmark = require("../Models/Bookmark");
const authMiddleware = require("../Middleware/authMiddleware");

// api to save bookmark
router.post("/:storyId", authMiddleware, async (req, res) => {
  try {
    const loggedInUserId = req.user.username;
    const storyId = req.params.storyId;

    const existingBookmark = await Bookmark.findOne({
      story: storyId,
      bookmarkedbyuser: loggedInUserId,
    });

    if (existingBookmark) {
      await Bookmark.deleteOne({ _id: existingBookmark._id });
      return res.json({ message: "Story bookmarked removed" });
    } else {
      await Bookmark.create({
        story: storyId,
        bookmarkedbyuser: loggedInUserId,
      });

      return res.json({ message: "Story bookmarked successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Story Bookmarked Failed" });
  }
});

//Bookmark stories by user
router.get("/bookmarkedslides", authMiddleware, async (req, res) => {
  try {
    console.log("Entering/bookmarkedslides route");
    const loggedInUserId = req.user.username;
    const bookmarkedSlides = await Bookmark.find({
      bookmarkedbyuser: loggedInUserId,
    });

    const slideIds = bookmarkedSlides.map((bookmark) => bookmark.story);

    const slidesToReturn = [];

    for (const slideId of slideIds) {
      const matchingSlide = await Story.findOne(
        { "slides._id": slideId },
        { slides: { $elemMatch: { _id: slideId } } }
      );
      if (matchingSlide && matchingSlide.slides.length > 0) {
        slidesToReturn.push(matchingSlide.slides[0]);
      }
    }
    
    res.json(
      slidesToReturn.length > 0
        ? slidesToReturn
        : { error: "No bookmarked slides found" }
        
    );
  } catch (error) {
    console.error("Error in /bookmarkedslides route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Search a story by its ID
router.get("/:id/bookmark", authMiddleware, async (req, res) => {
  try {
    const storyId = req.params.id;
    const loggedInUserId = req.user.username;
    const bookmark = await Bookmark.findOne({
      story: storyId,
      bookmarkedbyuser: loggedInUserId,
    });

    if (bookmark) {
      return res.json({ isBookmarked: true });
    }

    res.json({ isBookmarked: false });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
