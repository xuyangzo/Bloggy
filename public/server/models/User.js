const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// SubSchema for comments
const commentSchema = mongoose.Schema({}, { _id: false });

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
  },
  beingFollowed: {
    type: [String]
  },
  following: {
    type: [String]
  },
  comments: [
    {
      linked_post_id: {
        type: String,
        required: true
      },
      linked_comm_id: {
        type: String,
        required: true
      },
      text: {
        type: String,
        required: true
      },
      dateTime: {
        type: Date,
        default: Date.now
      }
    }
  ],
  favorites: [
    {
      linked_post_id: {
        type: String
      }
    }
  ],
  subscribe: {
    type: Boolean,
    default: true
  }, 
  subscribe_freq:{
    type: Number,
    default: 1
  }
});

module.exports = User = mongoose.model("users", UserSchema);
