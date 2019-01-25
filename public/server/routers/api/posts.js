const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoosastic = require("mongoosastic");
const uuidv1 = require("uuid/v1");

// Load Input Validation
const validatePostInput = require("../../validation/post.validation.js");
const validateCommentInput = require("../../validation/comment.validation.js");
var elasticsearch = require("elasticsearch");

// Load Post and User Model
const Post = require("../../models/Post");
const User = require("../../models/User");

const esClient = new elasticsearch.Client({
  host:
    "https://search-bloggy-iec77mrsmswpriiofnkjh3ggrq.us-west-1.es.amazonaws.com"
});


// Array.prototype.indexOf = function(val) {
//     for (var i = 0; i < this.length; i++) {
//         if (this[i] == val) return i;
//     }
//     return -1;
// };
//
// Array.prototype.remove = function(val) {
//     var index = this.indexOf(val);
//     if (index > -1) {
//         this.splice(index, 1);
//     }
// };

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
        { safe: true, upsert: true, new: true, useFindAndModify: false },
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
    if (typeof req.body.tags !== "undefined") {
        postFields.tags = req.body.tags.split(",");
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
                // const newTag = {
                // tagname = req.body.tagname;
                // };
                if(post.tags.length == 3){
                    errors.post = "The tag amount reaches the maximum value!";
                    res.status(404).json(errors);
                }
                else if(post.tags.includes(req.body.tagName)){
                    errors.post = "This tag has already been assigned!";
                    res.status(404).json(errors);
                }
                else{
                    // Add to tags list
                    
                    post.tags.unshift(req.body.tagName);
                    // Save post
                    post.save().then(post => res.json(post));
                }

            })
            .catch(err => res.status(404).json({ nopostfound: "No post found" }));
    }

    Post.findOne({ _id: req.params.post_id })
      .then(post => {
        // const newTag = {
        // tagname = req.body.tagname;
        // };
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
                if(post.tags.includes(req.body.tagName)){
                    for(var i = 0; i < post.tags.length;i++){
                        if(post.tags[i] == req.body.tagName)
                            post.tags.splice(i,1);
                    }
                    // Save post
                    post.save().then(post => res.json(post));
                    
                }
                else{
                   
                    errors.post = "This tag does not exist!";
                    res.status(404).json(errors);
                }

            })
            .catch(err => res.status(404).json({ nopostfound: "No post found" }));
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
    client.deleteByQuery({
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
          avatar: req.body.avatar,
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
          .then(user => res.json(user))
          .catch(err =>
            res.status(404).json({ usernotfound: "User not found" })
          );
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

module.exports = router;
