import express from 'express';
import { getPosts, createPost, upvotePost, getComments, addComment } from '../controllers/communityController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/posts', getPosts);
router.post('/posts', protect, createPost);
router.put('/posts/:id/upvote', protect, upvotePost);

router.get('/posts/:id/comments', getComments);
router.post('/posts/:id/comments', protect, addComment);

export default router;
