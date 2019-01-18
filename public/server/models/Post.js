const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema for single Post
const PostSchema = new Schema({
  linked_userid: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ""
  },
  author: {
    type: String,
    default: "Anonymous"
  },
  dateTime: {
    type: Date,
    default: Date.now
  },
  text: {
    type: String,
    required: true
  },
  sources: {
    type: [String]
  }
});

module.exports = Post = mongoose.model("posts", PostSchema);
