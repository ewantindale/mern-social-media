const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Post = require("../../models/Post");
const Comment = require("../../models/Comment");
const User = require("../../models/User");

//  GET /api/posts
//  Retrieves a list of ALL posts from users followed
router.get("/", auth, (req, res) => {
  User.findById(req.user.id)
    .then((user) =>
      Post.find({ authorId: [...user.following, req.user.id] })
        .sort({ date: -1 })
        .then((posts) => {
          posts.forEach((post) => {
            User.findById(post.authorId).then((user) => {
              post.authorProfilePic = user.profilePic;
              post.comments.forEach((comment) => {
                User.findById(comment.authorId).then((commentAuthor) => {
                  comment.authorProfilePic = commentAuthor.profilePic;
                });
              });
              post.save();
            });
          });
          res.json(posts);
        })
    )
    .catch((err) => res.status(500).json({ error: err }));
});

//  GET /api/posts/:id
//  Retrieves the post object with specified id
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (!post) return res.status(400).json({ msg: "Post does not exist" });

      res.json(post);
    })
    .catch((err) => res.status(500).json({ error: err }));
});

//  GET /api/posts/user/:id
//  Retrieves all posts by user id
router.get("/user/:id", (req, res) => {
  Post.find({ authorId: req.params.id })
    .sort({ date: -1 })
    .then((posts) => {
      res.json(posts);
    })
    .catch((err) => res.status(500).json({ error: err }));
});

//  POST /api/posts/:id/like
//  Toggle like on a specific post
router.post("/:id/like", auth, (req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      const updatedPost = post;
      if (updatedPost.likedBy.includes(req.user.id)) {
        updatedPost.likedBy = updatedPost.likedBy.filter(
          (e) => e !== req.user.id
        );
      } else {
        updatedPost.likedBy.push(req.user.id);
      }
      updatedPost.save().then((post) => res.json(post));
    })
    .catch((err) => res.status(500).json({ success: false }));
});

//  POST /api/posts/:id/comment
//  Add a comment on a specific post
router.post("/:id/comment", auth, (req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      const updatedPost = post;
      const comment = new Comment({
        body: req.body.body,
        author: req.body.author,
        authorId: req.body.authorId,
        authorProfilePic: req.body.authorProfilePic,
        date: req.body.date,
      });
      updatedPost.comments.unshift(comment);
      updatedPost.save().then(() => res.json({ id: req.params.id, comment }));
    })
    .catch((err) => res.status(500).json({ success: false }));
});

//  POST /api/posts
//  Creates a new post
router.post("/", auth, (req, res) => {
  const newPost = new Post({
    body: req.body.body,
    author: req.body.author,
    authorId: req.body.authorId,
    authorProfilePic: req.body.authorProfilePic,
    date: req.body.date,
  });

  newPost
    .save()
    .then((post) => res.json(post))
    .catch((err) => res.status(500).json({ error: err }));
});

//  DELETE /api/posts/:id
//  Deletes a specific post
router.delete("/:id", auth, (req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (req.user.id !== post.authorId)
        return res
          .status(401)
          .json({ msg: "Incorrect user ID, authorization denied" });
      post.remove().then(() => res.json({ success: true }));
    })
    .catch((err) => res.status(500).json({ success: false }));
});

module.exports = router;
