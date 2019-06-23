const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// SubSchema for comments
const commentSchema = mongoose.Schema({}, { _id: false });

// Create Schema for single User
const FavoriteSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    required: true
  },
  user_name: {},
  posts: {
    type: [String]
  },
});

module.exports = User = mongoose.model("favorites", UserSchema);
