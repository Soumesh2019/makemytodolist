const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please Provide username"],
  },
  password: {
    type: String,
    required: [true, "Please Provide password"],
  },
  email: {
    type: String,
    required: [true, "Please Provide email"],
  },
  toDoItem: Array,
});

const userModel = new mongoose.model("user", userSchema);

module.exports = userModel;
