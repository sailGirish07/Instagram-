const express = require("express");
const {
  getProfile,
  updateProfile,
  getUserPosts,
  getUserById,
  searchUsers,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} = require("../controllers/userController");

const auth = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

// Logged-in user profile
router.get("/profile", auth, getProfile);
router.put("/profile", auth, upload.single("profilePic"), updateProfile);
router.get("/profile-posts", auth, getUserPosts);

// Public profile & search
router.get("/user/:id", auth, getUserById);
router.get("/search", auth, searchUsers);

// Follow a user
router.put("/:userId/follow", auth, followUser);

// Unfollow a user
router.put("/:userId/unfollow", auth, unfollowUser);

// Get followers
router.get("/:userId/followers", auth, getFollowers);

// Get following
router.get("/:userId/following", auth, getFollowing);

module.exports = router;
