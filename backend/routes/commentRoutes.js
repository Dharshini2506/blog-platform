const express = require('express');
const { getCommentsByPost, createComment, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/post/:postId', getCommentsByPost);
router.post('/', protect, createComment);
router.delete('/:id', protect, deleteComment);

module.exports = router;