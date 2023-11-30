const express = require("express");
const router = express.Router();
const Story = require("../Models/Story");
const mongoose = require("mongoose");
const Bookmark = require("../Models/Bookmark");
const authMiddleware = require("../Middleware/authMiddleware")

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
    res.status(500).json({ error: "Internal server error" });
  }
});

// api to get all the bookmark stories by user
router.get("/bookmarkedslides", authMiddleware, async (req, res) => {
  try {
    const loggedInUserId = req.user.username;
    const bookmarkedSlides = await Bookmark.find({
      bookmarkedbyuser: loggedInUserId,
    });

    console.log("Bookmarked Slides:", bookmarkedSlides);

    const slideIds = bookmarkedSlides.map((bookmark) => bookmark.story);

    console.log("Slide IDs:", slideIds);

    const slidesToReturn = [];

    for (const slideId of slideIds) {
      const matchingSlide = await Story.findOne(
        { "slides._id": slideId },
        { slides: { $elemMatch: { _id: slideId } } }
      );

      console.log("Matching Slide:", matchingSlide);

      if (matchingSlide && matchingSlide.slides.length > 0) {
        slidesToReturn.push(matchingSlide.slides[0]);
      }
    }

    console.log("Slides to Return:", slidesToReturn);

    res.json(
      slidesToReturn.length > 0
        ? slidesToReturn
        : { error: "No bookmarked slides found" }
    );
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API to search a story by its ID
router.get("/:id/isbookmarked", authMiddleware, async (req, res) => {
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