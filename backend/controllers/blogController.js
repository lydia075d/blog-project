const Blog = require("../models/Blog");
const Comment = require("../models/Comment");
const fs = require("fs");
const path = require("path");

const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;  
    const video = req.body.video;

    const newBlog = new Blog({ title, content, image, user: req.user.id });
    await newBlog.save();

    res.status(201).json({ message: "Blog created successfully", blog: newBlog });
  } catch (error) {
    res.status(500).json({ message: "Failed to create blog", error: error.message });
  }
};

const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("user", "username").limit(10);
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
};

const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("user", "username");
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blog" });
  }
};

const getCommentsForBlog = async (req, res) => {
  try {
    const comments = await Comment.find({ blog: req.params.id }).populate("user", "username");
    if (!comments) {
      return res.status(404).json({ message: "No comments found for this blog" });
    }
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch comments", error: error.message });
  }
};

const addCommentToBlog = async (req, res) => {
  try {
    const { content } = req.body;
    const blogId = req.params.id;

    const newComment = new Comment({
      content,
      user: req.user.id,
      blog: blogId,
    });

    await newComment.save();
    res.status(201).json({ message: "Comment added successfully", comment: newComment });
  } catch (error) {
    res.status(500).json({ message: "Failed to add comment", error: error.message });
  }
};

const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const userId = req.user.id;

    if (blog.likes.includes(userId)) {
      blog.likes = blog.likes.filter(like => like !== userId);
    } else {
      blog.likes.push(userId);
    }

    await blog.save();
    res.status(200).json({ message: "Blog liked/unliked", likes: blog.likes });
  } catch (error) {
    res.status(500).json({ message: "Failed to like blog", error: error.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    if (blog.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to delete this blog" });
    }

    if (blog.image) {
      const imagePath = path.join(__dirname, "..", "uploads", blog.image.replace("uploads/", ""));
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image:", err);
        }
      });
    }

    await Blog.findByIdAndDelete(req.params.id);

    await Comment.deleteMany({ blog: req.params.id });

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ message: "Failed to delete blog" });
  }
};

module.exports = { 
  createBlog, 
  getBlogs, 
  getBlogById, 
  likeBlog, 
  getCommentsForBlog, 
  addCommentToBlog, 
  deleteBlog 
};
