const mongoose = require("mongoose");
const timeStamps = require("mongoose-timestamp");

const UsersSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  userName: {
    type: String,
    required: false,
  },

  city: {
    type: String,
    required: false,
    default: "",
  },

  state: {
    type: String,
    required: false,
    default: "",
  },

  country: {
    type: String,
    required: false,
    default: "",
  },

  gender: {
    type: String,
    required: false,
    enum: ["MALE", "FEMALE", "N/A"],
    default: "N/A",
  },

  race: {
    type: String,
    required: false,
    enum: ["AFRICAN", "AMERICAN", "ASIAN", "WHITE", "N/A"],
    default: "N/A",
  },

  isOnline: {
    type: Boolean,
    default: false,
  },

  token: {
    type: String,
    required: false,
  },
});

UsersSchema.plugin(timeStamps, {
  createdAt: "created_at",

  updatedAt: "updated_at",
});

const UsersModel = mongoose.model("Users", UsersSchema);

module.exports = UsersModel;
