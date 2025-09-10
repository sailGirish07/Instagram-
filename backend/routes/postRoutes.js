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

router.post("/", auth, upload.single("media"), createPost);
router.get("/profile-posts", auth, getProfilePosts);
router.get("/", auth, getAllPosts);
router.put("/:postId/like", auth, toggleLike);

router.post("/:postId/comment", auth, addComment);
// Get all comments for a post
router.get("/:postId/comments", auth, getComments);

router.put("/:postId/save", auth, toggleSavePost);

router.get("/saved", auth, getSavedPosts);
module.exports = router;
