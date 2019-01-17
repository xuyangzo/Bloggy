const express = require("express");
const router = express.Router();
const passport = require("passport");

// Load Input Validation
const validatePostInput = require("../../validation/post.validation.js");

// Load Post and User Model
const Post = require("../../models/Post");
const User = require("../../models/User");

// @route   GET api/posts/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) =>
  res.json({
    msg: "Post Works"
  })
);

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

    // get fields
    const postFields = {};
    postFields.linked_userid = req.user.id;
    postFields.author = req.user.username;
    if (req.body.title) postFields.title = req.body.title;
    if (req.body.subtitle) postFields.subtitle = req.body.subtitle;
    if (req.body.dateTime) postFields.dateTime = req.body.dateTime;
    if (req.body.text) postFields.text = req.body.text;
    // sources - split into array
    if (typeof req.body.sources !== "undefined") {
      postFields.sources = req.body.sources.split(",");
    }

    // save post
    new Post(postFields).save().then(post => {
      // update User Model
      User.findOneAndUpdate(
        { _id: req.user.id },
        { $push: { posts: post.id } },
        { safe: true, upsert: true, new: true },
        (err, user) => {
          if (err) return res.status(400).json(err);
          else return res.json(user);
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

    // get fields
    const postFields = {};
    if (req.body.title) postFields.title = req.body.title;
    if (req.body.subtitle) postFields.subtitle = req.body.subtitle;
    if (req.body.dateTime) postFields.dateTime = req.body.dateTime;
    if (req.body.text) postFields.text = req.body.text;
    // sources - split into array
    if (typeof req.body.sources !== "undefined") {
      postFields.sources = req.body.sources.split(",");
    }

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

// @route   GET api/posts/view
// @desc    View Post
// @access  Public
router.get("/view/:post_id", (req, res) => {
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
      res.status(404).json({ post: "There is no content fot this post" })
    );
});

module.exports = router;
