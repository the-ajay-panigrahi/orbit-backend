require("dotenv").config();
const express = require("express");
const ConnectDB = require("./config/database");
const User = require("./models/user");

const app = express();
const PORT = process.env.PORT || 7777;

app.use(express.json());

app.post("/signup", async (req, res) => {
  console.log(req.body);

  try {
    const userObject = req.body;

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

// get one user from the db
app.get("/user", async (req, res) => {
  console.log(req.body.lastName);

  // const user = await User.findById(req.body.myId);
  const user = await User.findOne({ lastName: req.body.lastName });
  console.log(user);

  res.send(user);
});

// Feed-api, get all users from the db
app.get("/feed", async (req, res) => {
  const users = await User.find({});
  console.log(users);

  res.send(users);
});

app.delete("/user", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.body.myId);
    res.send("user successfully deleted!");
  } catch (error) {
    res.status(400).send("Something went wrong!");
  }
});

app.patch("/user", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { lastName: req.body.lastName },
      req.body,
      {
        returnDocument: "after",
      },
    );
    console.log(user);

    if (!user) {
      res.status(400).send("No user found!");
    } else {
      res.send("user successfully updated");
    }
  } catch (error) {
    console.log(error.message);

    res.status(400).send("Something went wrong!");
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
