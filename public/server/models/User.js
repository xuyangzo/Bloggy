const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema for single User
const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  avatar: {
    type: String
  },
  posts: {
    type: [String]
  }
});

module.exports = User = mongoose.model("users", UserSchema);
