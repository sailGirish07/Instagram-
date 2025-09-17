const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const auth = require("../middlewares/authMiddleware");
const {
  createPost,
  getProfilePosts,
  getAllPosts,
  toggleLike,
  addComment,
  getComments,
  toggleSavePost,
  getSavedPosts,
} = require("../controllers/postController");

// Create a post
router.post("/", auth, upload.single("media"), createPost);
// Get profile posts
router.get("/profile-posts", auth, getProfilePosts);

router.get("/", auth, getAllPosts);

// Like/unlike a post
router.put("/:postId/like", auth, toggleLike);

// Add comment
router.post("/:postId/comment", auth, addComment);

// Get all comments for a post
router.get("/:postId/comments", auth, getComments);

// Save/unsave post
router.put("/:postId/save", auth, toggleSavePost);

// Get all saved posts
router.get("/saved", auth, getSavedPosts);

module.exports = router;
