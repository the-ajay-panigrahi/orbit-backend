const express = require("express");
const { adminAuth } = require("./middlewares/auth");

const app = express();
const PORT = 7777;

app.use("/admin", adminAuth);

app.get("/admin/data", (req, res) => {
  res.send("data given");
});

app.get("/admin/user", (req, res) => {
  console.log("Jai Ho");

  res.send("user given");
});

app.get(
  "/user",
  (req, res, next) => {
    console.log("1st request handler.");
    return res.send("Response of 1st handler.");
    next();
  },
  (req, res, next) => {
    console.log("2nd request handler.");
    res.send("Response of 2nd handler.");
    next();
  },
  (req, res) => {
    console.log("3rd request handler.");
    res.send("Response of 3rd handler.");
  },
  (req, res) => {
    console.log("4th request handler.");
    res.send("Response of 4th handler.");
  },
  (req, res) => {
    console.log("5th request handler.");
    res.send("Response of 5th handler.");
  },
);

app.listen(PORT, () => {
  console.log(`Server is successfully running on port ${PORT}`);
});
