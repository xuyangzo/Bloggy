const express = require("express");
const router = express.Router();

const Post = require("../../models/Post");

require("dotenv").config();

/* Elastic Search */
var elasticsearch = require("elasticsearch");
var client = new elasticsearch.Client({
  host: process.env.ELASTICSEARCH_HOST,
  log: process.env.ELASTICSEARCH_LOG
});

// @route   GET api/search/author
// @desc    Search Post
// @access  Public
router.get("/author/:author", (req, res) => {
  let errors = {};
  Post.find({ author: req.params.author })
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

// @route   GET api/search/title
// @desc    Search Post
// @access  Public
router.get("/title/:title", (req, res) => {
  let errors = {};
  Post.find({ title: req.params.title })
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

// @route   GET api/search/subtitle
// @desc    Search Post
// @access  Public
router.get("/subtitle/:subtitle", (req, res) => {
  let errors = {};
  Post.find({ title: req.params.subtitle })
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

// @route   GET api/search/all
// @desc    Search Post
// @access  Public
router.get("/all/:keyword", (req, res) => {
  client
    .search({
      //keyword
      q: req.params.keyword,
      index: "postss",
      size: 999
    })
    .then(
      function(body) {
        var hits = body.hits.hits;
        res.send(hits);
      },
      function(error) {
        console.trace(error.message);
      }
    );
});

module.exports = router;
