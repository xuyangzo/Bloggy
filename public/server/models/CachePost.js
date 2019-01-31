// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
// const mongoosastic = require("mongoosastic");
// var elasticsearch = require("elasticsearch");
//
// const esClient = new elasticsearch.Client({
//     host:
//         "https://search-bloggy-iec77mrsmswpriiofnkjh3ggrq.us-west-1.es.amazonaws.com"
// });

// SubSchema for comments
const CacheComment = {
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
    reply_username:{
        type: String,
        default: ""
    },
    linked_reply_userid:{
        type: Schema.Types.ObjectId,
        ref: "users",
        default: 0
    }
});

// Create Schema for single Post
const CachePost = {
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

    sources: {
        type: [String],
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

    comments: [CacheComment]
};

module.exports = CachePost;
