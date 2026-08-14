const Post = require('../models/Post');
const Category = require('../models/Category');

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// @desc    Get all posts (with search, category filter, pagination)
// @route   GET /api/posts
exports.getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 9;
    const skip = (page - 1) * limit;

    const query = {};

    // Search by title or content
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { content: { $regex: req.query.search, $options: 'i' } },
        { excerpt: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    // Filter by Category slug
    if (req.query.category) {
      const cat = await Category.findOne({ slug: req.query.category });
      if (cat) {
        query.category = cat._id;
      }
    }

    // Filter by Author ID
    if (req.query.author) {
      query.author = req.query.author;
    }

    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('author', 'name email avatar bio')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: posts.length,
      totalPages: Math.ceil(total / limit) || 1,
      currentPage: page,
      total,
      posts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post by Slug or ID
// @route   GET /api/posts/:slugOrId
exports.getPost = async (req, res, next) => {
  try {
    const { slugOrId } = req.params;
    let post;

    if (slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
      post = await Post.findById(slugOrId)
        .populate('author', 'name email avatar bio')
        .populate('category', 'name slug');
    } else {
      post = await Post.findOne({ slug: slugOrId })
        .populate('author', 'name email avatar bio')
        .populate('category', 'name slug');
    }

    if (!post) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new post
// @route   POST /api/posts
exports.createPost = async (req, res, next) => {
  try {
    const { title, content, excerpt, coverImage, category, tags } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ success: false, message: 'Please provide title, content, and category' });
    }

    // Generate unique slug
    let baseSlug = slugify(title);
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (await Post.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const words = content.trim().split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(words / 200));

    const post = await Post.create({
      title,
      slug: uniqueSlug,
      content,
      excerpt: excerpt || content.slice(0, 140) + '...',
      coverImage: coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
      category,
      tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t) => t.trim()) : [],
      readTime,
      author: req.user._id,
    });

    const populated = await Post.findById(post._id)
      .populate('author', 'name email avatar')
      .populate('category', 'name slug');

    res.status(201).json({
      success: true,
      post: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing post
// @route   PUT /api/posts/:id
exports.updatePost = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    // Check ownership
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this article' });
    }

    const { title, content, excerpt, coverImage, category, tags } = req.body;

    if (title && title !== post.title) {
      let baseSlug = slugify(title);
      let uniqueSlug = baseSlug;
      let counter = 1;
      while (await Post.findOne({ slug: uniqueSlug, _id: { $ne: post._id } })) {
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
      }
      post.slug = uniqueSlug;
      post.title = title;
    }

    if (content) {
      post.content = content;
      const words = content.trim().split(/\s+/).length;
      post.readTime = Math.max(1, Math.ceil(words / 200));
    }
    if (excerpt !== undefined) post.excerpt = excerpt;
    if (coverImage !== undefined) post.coverImage = coverImage;
    if (category) post.category = category;
    if (tags !== undefined) {
      post.tags = Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t) => t.trim()) : [];
    }

    await post.save();

    const updated = await Post.findById(post._id)
      .populate('author', 'name email avatar')
      .populate('category', 'name slug');

    res.status(200).json({
      success: true,
      post: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this article' });
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Article deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's posts for Dashboard
// @route   GET /api/posts/user/my-posts
exports.getMyPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ author: req.user._id })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    next(error);
  }
};
