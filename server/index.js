
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const dbConnection = require("./DBConnection/Dbconection.js");
const auth = require("./Routes/auth");
const story = require("./Routes/story.js");
const bookmark = require("./Routes/bookmark");
const like = require("./Routes/likes.js")
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
dotenv.config();
app.use(express.json());


app.get("/", (req, resp) => {
  resp.status(200).json("Server is running");
});

app.use("/api/auth", auth);
app.use("/api/story", story);
app.use("/api/story/bookmark", bookmark);
app.use("/api/story/like", like);


// connect to server
app.listen(process.env.PORT, () => {
    dbConnection();
    console.log(`Server is running successfully on port ${process.env.PORT}`);
});
