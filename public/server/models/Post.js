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
  },
  likes: [
    {
      linked_like_userid: {
        type: Schema.Types.ObjectId,
        ref: "users"
      }
    }
  ],
  dislikes: [
    {
      linked_dislike_userid: {
        type: Schema.Types.ObjectId,
        ref: "users"
      }
    }
  ],
  comments: [
    {
      linked_comm_userid: {
        type: Schema.Types.ObjectId,
        ref: "users"
      },
      text: {
        type: String,
        required: true
      },
      username: {
        type: String,
        default: "Anonymous"
      },
      avatar: {
        type: String
      },
      dateTime: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

module.exports = Post = mongoose.model("posts", PostSchema);
