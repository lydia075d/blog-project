const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs"); 
const { createBlog, getBlogs, getBlogById, likeBlog, getCommentsForBlog, addCommentToBlog, deleteBlog } = require("../controllers/blogController");
const { authenticateUser } = require("../middlewares/authMiddleware");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

router.post("/", authenticateUser, upload.single("image"), createBlog);
router.get("/", getBlogs);
router.get("/:id", getBlogById);
router.post("/:id/like", authenticateUser, likeBlog);

router.delete("/:id", authenticateUser, deleteBlog);

router.get("/:id/comments", getCommentsForBlog); 
router.post("/:id/comments", authenticateUser, addCommentToBlog); 

module.exports = router;
