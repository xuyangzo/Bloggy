const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const passport = require("passport");
const fs = require("fs");
const Grid = require("gridfs-stream");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary");
var multiparty = require("connect-multiparty")();
// var Redis = require("ioredis");
const redis = require("redis");
var msg_count = 0;
const sub = redis.createClient({
  host: "redis-10859.c84.us-east-1-2.ec2.cloud.redislabs.com",
  port: "10859",
  no_ready_check: true,
  auth_pass: "LdDfI0ZyLFrLh5XTVKgpisyXKKFx3ZCz"
});

const pub = redis.createClient({
  host: "redis-10859.c84.us-east-1-2.ec2.cloud.redislabs.com",
  port: "10859",
  no_ready_check: true,
  auth_pass: "LdDfI0ZyLFrLh5XTVKgpisyXKKFx3ZCz"
});

//
//
sub.once("connect", function() {
  console.log("redis connected");
});
sub.on("error", function(err) {
  console.log("redis client connection failed", err);
});

// Load Input Validation
const validateRegisterInput = require("../../validation/register.validation.js");
const validateLoginInput = require("../../validation/login.validation.js");

// Load User Model
const User = require("../../models/User");

// DB Config
const db = process.env.MONGO_URI;

// Connet to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    // console.log("MongoDB Connected");
  })
  .catch(err => console.log(err));

mongoose.Promise = global.Promise;
Grid.mongo = mongoose.mongo;
var gfs;
var connection = mongoose.connection;

cloudinary.config({
  cloud_name: "bloggy-image",
  api_key: "359384838787325",
  api_secret: "VRiy697bEl6zg_531OXARm_9YB8"
});

router.post(
  "/upload/avatar",
  multiparty,
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // console.log(req.files);
    var filepath = req.files.filename.path;
    console.log(filepath);

    cloudinary.v2.uploader.destroy(req.user.id, function(error, result) {
      console.log(result, error);
      var filename = req.files.filename.name;
      cloudinary.v2.uploader.upload(
        filepath,
        { public_id: req.user.id },
        function(error, result) {
          res.json(result);
          console.log(result, error);
          var new_avatar = result.url;
          console.log(new_avatar);
          User.findOneAndUpdate(
            { _id: req.user.id },
            { $set: { avatar: new_avatar } },
            // { $set: postFields },
            { new: true, useFindAndModify: false }
          )
            .then(post => res.json(post))
            .catch(err => res.status(400).json(err));
        }
      );
    });
  }
);
// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) =>
  res.json({
    msg: "User Works"
  })
);

// @route   POST api/users/register
// @desc    Register a user
// @access  Public
router.post("/register", (req, res) => {
  // check validation
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({
    email: req.body.email
  }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      // obtain user avatar
      const avatar = gravatar.url(req.body.email, {
        s: "200", // size
        r: "pg", // Rating
        d: "mm" // Default
      });

      // create User object
      const newUser = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        avatar
      });

      // encrypt
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   POST api/posts/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post("/login", (req, res) => {
  // check validation
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // check password
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then(user => {
    // check for user
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched
        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar
        };
        // Sign Token
        jwt.sign(
          payload,
          process.env.SECRET_OR_KEY,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOne({ _id: req.user.id })
      .then(user => res.json(user))
      .catch(err => res.status(404).json({ usernotfound: "User not found" }));
  }
);

// @route   GET api/users/:user_id
// @desc    Return user with that user id
// @access  Public
router.get("/:user_id", (req, res) => {
  User.findOne({ _id: req.params.user_id })
    .then(user => res.json(user))
    .catch(err => res.status(404).json({ usernotfound: "User not found" }));
});

// @route   POST api/users/follow/:followed_user_id
// @desc    Follow another user
// @access  Private
router.post(
  "/follow/:followed_user_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    var exist = false;
    User.findOne({ _id: req.params.followed_user_id })
      .then(user => {
        // check for user
        if (!user) {
          errors.email = "User not found";
          return res.status(404).json(errors);
        }
        if (user.beingFollowed.includes(req.user.id)) {
          errors.email = "This user has already been followed!";
          return res.status(404).json(errors);
        } else {
          User.findOneAndUpdate(
            { _id: req.params.followed_user_id },
            { $push: { beingFollowed: req.user.id } },
            { safe: true, useFindAndModify: false }
          )
            .then(user => {
              if (user) {
                User.findOneAndUpdate(
                  { _id: req.user.id },
                  { $push: { following: req.params.followed_user_id } },
                  { safe: true, useFindAndModify: false }
                )
                  .then(current_user => res.json(current_user))
                  .catch(err =>
                    res.status(404).json({ usernotfound: "User not found" })
                  );
              }
            })
            .catch(err =>
              res.status(404).json({ usernotfound: "User not found" })
            );
        }
      })
      .catch(err => res.status(404).json({ usernotfound: "User not found" }));
  }
);

// @route   POST api/users/unfollow/:followed_user_id
// @desc    Unfollow another user
// @access  Private
router.post(
  "/unfollow/:followed_user_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOneAndUpdate(
      { _id: req.params.followed_user_id },
      { $pull: { beingFollowed: req.user.id } },
      { safe: true, useFindAndModify: false }
    )
      .then(user => {
        if (user) {
          User.findOneAndUpdate(
            { _id: req.user.id },
            { $pull: { following: req.params.followed_user_id } },
            { safe: true, useFindAndModify: false }
          )
            .then(current_user => res.json(current_user))
            .catch(err =>
              res.status(404).json({ usernotfound: "User not found" })
            );
        }
      })
      .catch(err => res.status(404).json({ usernotfound: "User not found" }));
  }
);

// @route   POST api/users/subscribe
// @desc    Subscribe or cancel subscription
// @access  Private
router.post(
  "/subscribe",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOneAndUpdate(
      { _id: req.user.id },
      { $set: { subscribe: req.body.tosubscribe } },
      { safe: true, useFindAndModify: false }
    )
      .then(user => res.json(user))
      .catch(err => res.status(404).json({ usernotfound: "User not found" }));
  }
);

// @route   GET api/users/view/:user_id
// @desc    View user
// @access  Private
router.get(
  "/view/:user_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOne({ _id: req.user.id })
      .then(user => res.json(user))
      .catch(err => res.status(404).json({ usernotfound: "User not found" }));
  }
);

module.exports = router;
