const  {mongoose}  = require("mongoose");
const mongoose = require("mongoose");

const ConnectDB = async () => {
  if (!process.env.DB_CONNECTION_URI) {
    throw new Error("DB_CONNECTION_URI is not defined in environment variables!");
  }
  await mongoose.connect(process.env.DB_CONNECTION_URI);
};

module.exports = ConnectDB;

module.exports = ConnectDB;
