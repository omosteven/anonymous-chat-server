const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const dbURI =
  process.env.NODE_ENV === "production"
    ? process.env.PROD_DATABASE
    : process.env.DEV_DATABASE;

const connectDb = async () => {
  try {
    await mongoose.connect(dbURI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    console.log("Database is connected");
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDb;
