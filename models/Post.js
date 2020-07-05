const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Comment = require('./Comment');

const PostSchema = new Schema({
  body: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  authorId: {
    type: String,
    required: true
  },
  authorProfilePic: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  },
  likedBy: [String],
  comments: [{
    body: String,
    author: String,
    authorId: String,
    date: Date
  }]
});

module.exports = Post = mongoose.model('post', PostSchema)