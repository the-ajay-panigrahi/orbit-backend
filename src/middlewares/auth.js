const adminAuth = (req, res, next) => {
  console.log("Admin Auth middleware running!");

  const token = "xyz";
  const adminUser = token === "xyz";
  if (!adminUser) {
    return res.send("Error");
  } else {
    next();
  }
};

module.exports = {
  adminAuth,
};
