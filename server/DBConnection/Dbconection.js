const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URL; 

const dbConnection = () => {
  mongoose.connect(MONGODB_URI);

  const connection = mongoose.connection;

  connection.once("open", () => {
    console.log("Connected to the database successfully");
  });

  connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });
};

module.exports = dbConnection;
