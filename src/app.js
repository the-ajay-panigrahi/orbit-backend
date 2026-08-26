require("dotenv").config();
const express = require("express");
const ConnectDB = require("./config/database");

const app = express();
const PORT = process.env.PORT || 7777;

ConnectDB()
  .then(() => {
    console.log("DB connection established successfully!");
    app.listen(PORT, () => {
      console.log(`Server is successfully running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("DB connection failed!!", error);
  });
