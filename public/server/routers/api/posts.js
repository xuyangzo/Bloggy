const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoosastic = require("mongoosastic");
const uuidv1 = require("uuid/v1");

const moment = require("moment");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const fs = require("fs");

// Load Input Validation
const validatePostInput = require("../../validation/post.validation.js");
const validateCommentInput = require("../../validation/comment.validation.js");
var elasticsearch = require("elasticsearch");

// Load Post and User Model
const Post = require("../../models/Post");
const User = require("../../models/User");

require("dotenv").config();

const esClient = new elasticsearch.Client({
  host: process.env.ELASTICSEARCH_HOST
});

let transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE_TYPE,
  port: 465, // SMTP
  secureConnection: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  }
});

const redis = require("redis");
var msg_count = 0;
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  no_ready_check: true,
  auth_pass: process.env.REDIS_AUTH_PASSWORD
});

// @route   GET api/posts/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) =>
  res.json({
    msg: "Post Works"
  })
);

// @route   GET api/posts/all
// @desc    Get All Posts' ID
// @access  Public
router.get("/all", (req, res) => {
  Post.find({})
    .sort({ dateTime: -1 })
    .then(posts => {
      res.json(posts.map(post => post._id));
    })
    .catch(err => res.status(404).json({ nopostfound: "No post found" }));
});

// @route   GET api/posts/index/:index
// @desc    Get First 6 posts for Index Page
// @access  Public
router.get("/index/:index", (req, res) => {
  const index = parseInt(req.params.index, 10);
  redisClient.lrange("posts", -3 - index, -1 - index, function(err, items) {
    if (err) throw err;
    // var posts = [];
    var posts = [];
    for (var i = items.length - 1; i >= 0; i--) {
      // console.log(" " + items[i]);
      posts.push(JSON.parse(items[i]));
    }
    res.json(posts);
  });
});

// @route   POST api/posts/create
// @desc    Create Post
// @access  Private
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // check validation
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }
    //create cache fields for redis
    const cpostFields = {};
    cpostFields.linked_userid = req.user.id;
    cpostFields.avatar = req.user.avatar;
    cpostFields.author = req.user.username;
    if (req.body.title) cpostFields.title = req.body.title;
    if (req.body.subtitle) cpostFields.subtitle = req.body.subtitle;
    cpostFields.dateTime = moment().format();
    if (req.body.sources) cpostFields.sources = req.body.sources;

    // get fields
    const postFields = {};
    postFields.linked_userid = req.user.id;
    postFields.avatar = req.user.avatar;
    postFields.author = req.user.username;
    if (req.body.title) postFields.title = req.body.title;
    if (req.body.subtitle) postFields.subtitle = req.body.subtitle;
    // if (req.body.dateTime) postFields.dateTime = req.body.dateTime;
    if (req.body.text) postFields.text = req.body.text;
    if (req.body.sources) postFields.sources = req.body.sources;

    // save post
    new Post(postFields).save().then(post => {
      cpostFields._id = post.id;

      var cachepost = new Object(cpostFields);
      var cp = JSON.stringify(cachepost);
      // console.log(cp);

      redisClient.rpush("posts", cp, redis.print);
      // update User Model
      User.findOneAndUpdate(
        { _id: req.user.id },
        { $push: { posts: post.id } },
        { safe: true, upsert: true, new: true, useFindAndModify: false },
        (err, user) => {
          user.beingFollowed.forEach(function(u) {
            User.findOne({ _id: u }).then(user => {
              if (user) {
                if (user.subscribe) {
                  let mailOptions = {
                    from: '"Bloggy" <bloggy233@gmail.com>', // sender address
                    to: user.email, // list of receivers
                    subject: "Notice from Bloggy", // Subject line
                    html: "<b>Hello world?</b>" // html body
                  };
                  // send mail with defined transport object
                  transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                      return console.log(error);
                    }
                    console.log("Message sent: %s", info.messageId);
                  });
                }
              }
            });
          });
          if (err) return res.status(400).json(err);
          else return res.json(post);
        }
      );
    });
  }
);

// @route   POST api/posts/edit
// @desc    Edit Post
// @access  Private
router.post(
  "/edit/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // check validation
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }
    //create cache fields for redis
    const cpostFields = {};
    cpostFields.linked_userid = req.user.id;
    cpostFields.avatar = req.user.avatar;
    cpostFields.author = req.user.username;
    if (req.body.title) cpostFields.title = req.body.title;
    if (req.body.subtitle) cpostFields.subtitle = req.body.subtitle;
    cpostFields.dateTime = moment().format();
    if (req.body.sources) cpostFields.sources = req.body.sources;

    // get fields
    const postFields = {};
    if (req.body.title) postFields.title = req.body.title;
    if (req.body.subtitle) postFields.subtitle = req.body.subtitle;
    if (req.body.dateTime) postFields.dateTime = req.body.dateTime;
    if (req.body.text) postFields.text = req.body.text;
    if (req.body.sources) postFields.sources = req.body.sources;
    // tags - split into array
    if (typeof req.body.tags !== "undefined") {
      postFields.tags = req.body.tags.split(",");
    }
    //update redis
    redisClient.lrange("posts", 0, -1, function(err, items) {
      if (err) throw err;
      // var posts = [];
      var posts = [];
      //find the one to be changed in cache list
      items.forEach(function(item, i) {
        // console.log(' ' + item);
        if (item.indexOf(req.params.post_id) >= 0) {
          redisClient.lrem("posts", -1, item);
          cpostFields._id = req.params.post_id;
          var cachepost = new Object(cpostFields);
          var cp = JSON.stringify(cachepost);
          // console.log(cp);
          redisClient.rpush("posts", cp, redis.print);
          // console.log("add success!!!");
        }
      });
    });
    // update post
    Post.findOneAndUpdate(
      { _id: req.params.post_id },
      { $set: postFields },
      { new: true, useFindAndModify: false }
    )
      .then(post => res.json(post))
      .catch(err => res.status(400).json(err));
  }
);

// @route   POST api/posts/addTag
// @desc    Add Tag
// @access  Private
router.post(
  "/addTag/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // check validation
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    Post.findOne({ _id: req.params.post_id })
      .then(post => {
        if (post.tags.length == 3) {
          errors.post = "The tag amount reaches the maximum value!";
          res.status(404).json(errors);
        } else if (post.tags.includes(req.body.tagName)) {
          errors.post = "This tag has already been assigned!";
          res.status(404).json(errors);
        } else {
          // Add to tags list

          post.tags.unshift(req.body.tagName);
          // Save post
          post.save().then(post => res.json(post));
        }
      })
      .catch(err => res.status(404).json({ nopostfound: "No post found" }));
  }
);

// @route   POST api/posts/removeTag
// @desc    Remove Tag
// @access  Private
router.delete(
  "/removeTag/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // check validation
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }
    Post.findOne({ _id: req.params.post_id })
      .then(post => {
        //find the tag
        if (post.tags.includes(req.body.tagName)) {
          for (var i = 0; i < post.tags.length; i++) {
            if (post.tags[i] == req.body.tagName) post.tags.splice(i, 1);
          }
          // Save post
          post.save().then(post => res.json(post));
        } else {
          errors.post = "This tag does not exist!";
          res.status(404).json(errors);
        }
      })
      .catch(err => res.status(404).json({ nopostfound: "No post found" }));
  }
);

// @route   api/posts/view
// @desc    View Post
// @access  Public
router.get("/view/:post_id", (req, res) => {
  let errors = {};
  Post.findOne({ _id: req.params.post_id }).then(post => {
    if (!post) {
      errors.post = "There is no content for this post";
      res.status(404).json(errors);
    }
    res.json(post);
  });
  // .catch(err =>
  //     res.status(404).json({ post: "There is no content for this post" })
  // );
});

// @route   api/posts/view
// @desc    View Post
// @access  Public
router.get("/viewtop/:post_id", (req, res) => {
  let errors = {};

  Post.findOne({ _id: req.params.post_id })
    .then(post => {
      if (!post) {
        errors.post = "There is no content for this post";
        res.status(404).json(errors);
      }
      res.json(post);
    })
    .catch(err =>
      res.status(404).json({ post: "There is no content for this post" })
    );
});

// @route   DELETE api/posts/delete/:post_id
// @desc    Delete Post
// @access  Private
router.delete(
  "/delete/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    redisClient.lrange("posts", 0, -1, function(err, items) {
      if (err) throw err;
      // var posts = [];
      var posts = [];
      items.forEach(function(item, i) {
        // console.log(' ' + item);
        if (item.indexOf(req.params.post_id) >= 0) {
          redisClient.lrem("posts", -1, item);
          // console.log("delete success!!!");
        }
      });
    });
    Post.findOneAndDelete(
      { _id: req.params.post_id },
      { safe: true, useFindAndModify: false }
    )
      .then(post => {
        if (post) {
          User.findOneAndUpdate(
            { _id: post.linked_userid },
            { $pull: { posts: req.params.post_id } },
            { safe: true, useFindAndModify: false }
          )
            .then(user => res.json(user))
            .catch(err => res.status(404).json({ user: "No such user found" }));
        }
      })
      .catch(err =>
        res.status(404).json({ posts: "There is no content for this post" })
      );
    esClient.deleteByQuery({
      index: "postss",
      body: {
        query: {
          term: { _id: req.params.post_id }
        }
      }
    });
  }
);

// @route   POST api/posts/comment/:post_id
// @desc    Post Comment
// @access  Private
router.post(
  "/comment/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Check Validation
    const { errors, isValid } = validateCommentInput(req.body);
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    Post.findOne({ _id: req.params.post_id })
      .then(post => {
        const newComment = {
          _id: uuidv1(),
          text: req.body.text,
          username: req.user.username,
          avatar: req.user.avatar,
          linked_comm_userid: req.user.id,
          dateTime: Date.now()
        };

        // Add to comments array
        post.comments.unshift(newComment);
        post.save().then();

        // Add comment to current User
        const userComment = {
          text: req.body.text,
          linked_post_id: req.params.post_id,
          linked_comm_id: newComment._id,
          dateTime: newComment.dateTime
        };
        User.findOneAndUpdate(
          { _id: req.user.id },
          { $push: { comments: userComment } },
          { safe: true, useFindAndModify: false }
        )
          .then()
          .catch(err =>
            res.status(404).json({ usernotfound: "User not found" })
          );

        res.json(post);
      })
      .catch(err => res.status(404).json({ nopostfound: "No post found" }));
  }
);

// @route   POST api/posts/comment/:post_id/:reply_user_id
// @desc    Post Comment
// @access  Private
router.post(
  "/comment/:post_id/:reply_user_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Check Validation
    const { errors, isValid } = validateCommentInput(req.body);
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    Post.findOne({ _id: req.params.post_id })
      .then(post => {
        const newComment = {
          _id: uuidv1(),
          text: req.body.text,
          username: req.user.username,
          avatar: req.user.avatar,
          linked_comm_userid: req.user.id,
          dateTime: Date.now(),
          reply_username: req.body.reply_username,
          linked_reply_userid: req.params.reply_user_id,
          linked_reply_commid: req.body.linked_reply_commid
        };

        // Add to comments array
        post.comments.unshift(newComment);
        post.comments = post.comments.filter(comment => {
          if (comment._id === req.body.linked_reply_commid) {
            comment.beingReplied.unshift(newComment._id);
            return comment;
          } else return comment;
        });
        post.save().then();

        // Add comment to current User
        const userComment = {
          text: req.body.text,
          linked_post_id: req.params.post_id,
          linked_comm_id: newComment._id,
          dateTime: newComment.dateTime
        };
        User.findOneAndUpdate(
          { _id: req.user.id },
          { $push: { comments: userComment } },
          { safe: true, useFindAndModify: false }
        )
          .then()
          .catch(err =>
            res.status(404).json({ usernotfound: "User not found" })
          );

        res.json(post);
      })
      .catch(err => res.status(404).json({ nopostfound: "No post found" }));
  }
);

// @route   DELETE api/posts/comment/delete/:post_id/:comment_id
// @desc    DELETE Comment
// @access  Private
router.delete(
  "/comment/delete/:post_id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findOneAndUpdate(
      { _id: req.params.post_id },
      { $pull: { comments: { _id: req.params.comment_id } } },
      { safe: true, useFindAndModify: false, multi: true }
    )
      .then(post => {
        res.json(post);
      })
      .catch(err => res.status(404).json({ nopostfound: "No post found" }));
  }
);

// @route   POST api/posts/like/:post_id
// @desc    Post Like
// @access  Private
router.post(
  "/like/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findOne({ _id: req.params.post_id })
      .then(post => {
        // If user already liked this post, cancel like
        if (
          post.likes.filter(
            like => like.linked_like_userid.toString() === req.user.id
          ).length > 0
        ) {
          post.likes = post.likes.filter(
            like => like.linked_like_userid.toString() != req.user.id
          );
          // Save
          post.save().then(post => res.json(post));
        } else if (
          post.dislikes.filter(
            dislike => dislike.linked_dislike_userid.toString() === req.user.id
          ).length > 0
        ) {
          // If user already disliked this post, remove it from dislike
          // and add it to the likes array
          post.dislikes = post.dislikes.filter(
            dislike => dislike.linked_dislike_userid.toString() != req.user.id
          );
          // Add user to the likes array
          post.likes.unshift({ linked_like_userid: req.user.id });
          post.save().then(post => res.json(post));
        } else {
          // Add user to the likes array
          post.likes.unshift({ linked_like_userid: req.user.id });
          // Save
          post.save().then(post => res.json(post));
        }
      })
      .catch(err => res.status(404).json({ nopostfound: "No post found" }));
  }
);

// @route   POST api/posts/dislike/:post_id
// @desc    Post Dislike
// @access  Private
router.post(
  "/dislike/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findOne({ _id: req.params.post_id })
      .then(post => {
        // If user already disliked this post, cancel dislike
        if (
          post.dislikes.filter(
            dislike => dislike.linked_dislike_userid.toString() === req.user.id
          ).length > 0
        ) {
          post.dislikes = post.dislikes.filter(
            dislike => dislike.linked_dislike_userid.toString() != req.user.id
          );
          // Save
          post.save().then(post => res.json(post));
        } else if (
          post.likes.filter(
            like => like.linked_like_userid.toString() === req.user.id
          ).length > 0
        ) {
          // If user already liked this post, remove it from like
          // and add it to the likes array
          post.likes = post.likes.filter(
            like => like.linked_like_userid.toString() != req.user.id
          );
          // Add user to the dislikes array
          post.dislikes.unshift({ linked_dislike_userid: req.user.id });
          post.save().then(post => res.json(post));
        } else {
          // Add user to the dislikes array
          post.dislikes.unshift({ linked_dislike_userid: req.user.id });
          // Save
          post.save().then(post => res.json(post));
        }
      })
      .catch(err => res.status(404).json({ nopostfound: "No post found" }));
  }
);

// @route   POST api/posts/favorite/:post_id
// @desc    Post Favorite
// @access  Private
router.post(
  "/favorite/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findOne({ _id: req.params.post_id }).then(post => {
      // if user alreay favorites this post, remove it
      if (
        post.favorite.filter(favor => favor._id.toString() === req.user.id)
          .length > 0
      ) {
        post.favorite = post.favorite.filter(
          favor => favor._id.toString() !== req.user.id
        );
        // remove from user's schema
        post
          .save()
          .then(post => {
            User.findOne({ _id: req.user.id })
              .then(user => {
                user.favorites = user.favorites.filter(
                  favorite => favorite._id.toString() != post._id
                );
                user
                  .save()
                  .then(user => res.json(user))
                  .catch({ savefile: "Update cannot be saved!" });
              })
              .catch({ usernotfound: "User cannot be found!" });
          })
          .catch({ savefile: "Update cannot be saved!" });
      } else {
        // otherwise, add it to favorite
        post.favorite.unshift(req.user.id);
        post
          .save()
          .then(post => {
            User.findOne({ _id: req.user.id })
              .then(user => {
                user.favorites.unshift(post._id);
                user
                  .save()
                  .then(user => res.json(user))
                  .catch({ savefile: "Update cannot be saved" });
              })
              .catch({ usernotfound: "User cannot be found!" });
          })
          .catch({ savefile: "Update cannot be saved!" });
      }
    });
  }
);

module.exports = router;
