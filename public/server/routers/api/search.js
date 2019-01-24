const express = require("express");
const router = express.Router();

const Post = require("../../models/Post");

// @route   GET api/search/view
// @desc    View Post
// @access  Public
router.get("/view/author/:author", (req, res) => {
    let errors = {};
    Post.find({author: req.params.author})
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


// @route   GET api/search/view
// @desc    View Post
// @access  Public
router.get("/view/title/:title", (req, res) => {
    let errors = {};
    Post.find({title: req.params.title})
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
