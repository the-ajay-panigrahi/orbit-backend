require("dotenv").config();
const express = require("express");
const ConnectDB = require("./config/database");
const User = require("./models/user");

const app = express();
const PORT = process.env.PORT || 7777;

app.post("/signup", async (req, res) => {
  try {
    const userObject = {
      firstName: "Ram",
      lastName: "Kapoor",
    };

    const user = new User(userObject);

    await user.save();
    res.status(200).send("User data saved successfully!!");
  } catch (error) {
    console.error(
      "Error occured while creating a user(doing signup) - ",
      error.message,
    );
    res.status(400).send("Signup failed!!");
  }
});

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
