import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

// @desc    Get all community posts
// @route   GET /api/community/posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name role')
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new post
// @route   POST /api/community/posts
export const createPost = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const post = await Post.create({
      user: req.user._id,
      title,
      content,
      category
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upvote a post
// @route   PUT /api/community/posts/:id/upvote
export const upvotePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.upvotes.includes(req.user._id)) {
      post.upvotes = post.upvotes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      post.upvotes.push(req.user._id);
    }
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get comments for a post
// @route   GET /api/community/posts/:id/comments
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id }).populate('user', 'name');
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a comment
// @route   POST /api/community/posts/:id/comments
export const addComment = async (req, res) => {
  try {
    const comment = await Comment.create({
      post: req.params.id,
      user: req.user._id,
      content: req.body.content
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
