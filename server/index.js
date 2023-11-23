const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const dbConnection = require("./DBConnection/Dbconection.js");
const auth = require("./Routes/auth");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
dotenv.config();
app.use(express.json());


app.get("/", (req, resp) => {
  resp.status(200).json("Server is running");
});

app.use(auth);
// connect to server
app.listen(process.env.PORT, () => {
    dbConnection();
    console.log(`Server is running successfully on port ${process.env.PORT}`);
});
