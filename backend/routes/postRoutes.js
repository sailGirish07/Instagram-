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
} = require("../controllers/postController");

router.post("/", auth, upload.single("media"), createPost);
router.get("/profile-posts", auth, getProfilePosts);
router.get("/", auth, getAllPosts);
router.put("/:postId/like", auth, toggleLike);
router.post("/:postId/comment", auth, addComment);

module.exports = router;
