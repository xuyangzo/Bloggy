const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosastic = require("mongoosastic");
var elasticsearch = require("elasticsearch");
const moment = require("moment");
const esClient = new elasticsearch.Client({
  host:
    "https://search-bloggy-iec77mrsmswpriiofnkjh3ggrq.us-west-1.es.amazonaws.com"
});

// SubSchema for comments
const commentSchema = new Schema({
  _id: false,
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
  },
  reply_username: {
    type: String,
    default: ""
  },
  linked_reply_userid: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  linked_reply_commid: {
    type: String
  },
  beingReplied: {
    type: [String]
  }
});

// Create Schema for single Post
const PostSchema = new Schema({
  linked_userid: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  title: {
    type: String,
    es_indexed: true,
    required: true
  },
  subtitle: {
    type: String,
    es_indexed: true,
    default: ""
  },
  author: {
    type: String,
    es_indexed: true,
    default: "Anonymous"
  },
  dateTime: {
    type: Date,
    es_indexed: true,
    default: moment().format()
  },
  text: {
    type: String,
    required: true
  },
  sources: {
    type: [String],
    es_indexed: true
  },
  tags: {
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

  comments: [commentSchema]
});

PostSchema.plugin(mongoosastic, {
  esClient: esClient
});
module.exports = Post = mongoose.model("posts", PostSchema);
