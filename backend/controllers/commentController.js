const Comment = require('../models/Comment');
const Post = require('../models/Post');

const getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createComment = async (req, res) => {
  try {
    const { content, postId } = req.body;
    
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    const comment = await Comment.create({
      content,
      author: req.user.id,
      post: postId,
    });
    
    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'name email');
    
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (comment && comment.author.toString() === req.user.id) {
      await comment.deleteOne();
      res.json({ message: 'Comment deleted' });
    } else {
      res.status(403).json({ message: 'Not authorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCommentsByPost, createComment, deleteComment };