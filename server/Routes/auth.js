const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/Users");
const dotenv = require("dotenv");
dotenv.config();

//register route
router.post("/register", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }
  
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }
  
      const encryptedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        username,
        password: encryptedPassword,
      });
  
       await newUser.save();
      const jwtToken = jwt.sign({ username }, process.env.SECRET_KEY);
  
      res.status(200).json({
        success: "Successfully registered",
        jwtToken,
        name: username,
      });
    } catch (error) {
      console.error(error); 
      res.status(500).json({ message: "Registration Failed" });
    }
  });
  
//login route
router.post("/login", async (req, resp) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return resp.json({ error: "All fields are required" });
    }
    const checkUser = await User.findOne({ username });
    if (checkUser) {
      const checkPassword = await bcrypt.compare(password, checkUser.password);
      if (checkPassword) {
        const jwtToken = jwt.sign({ username }, process.env.SECRET_KEY);
        return resp.status(200).json({
          success: "User logged in successfully",
          jwtToken,
          name: username,
        });
      }
    }
    return resp.json({ error: "Please enter valid username" });
  } catch (error) {
    return resp.json({ error: "something went wrong" });
  }
});

module.exports = router;
