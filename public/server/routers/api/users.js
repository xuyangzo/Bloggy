const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load Input Validation
const validateRegisterInput = require("../../validation/register.validation.js");
const validateLoginInput = require("../../validation/login.validation.js");

// Load User Model
const User = require("../../models/User");

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
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username }).then(user => {
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
          keys.secretOrKey,
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
    res.json({
      id: req.user.id,
      username: req.user.username,
      email: req.user.email
    });
  }
);

// @route   GET api/users/public/:user_id
// @desc    Return user with that user id
// @access  Public
// TODO

// @route   POST api/users/follow/:followed_user_id
// @desc    Follow another user
// @access  Private
router.post(
  "/follow/:followed_user_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
      var exist = false;
      User.findOne({ _id: req.params.followed_user_id }).then(user => {
          // check for user
          if (!user) {
              errors.email = "User not found";
              return res.status(404).json(errors);
          }
          if(user.beingFollowed.includes(req.user.id)){
              errors.email = "This user has already been followed!";
              return res.status(404).json(errors);
          }
          else{
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
                  .catch(err => res.status(404).json({ usernotfound: "User not found" }));
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

module.exports = router;
