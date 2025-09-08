// const express = require('express');
// const {getProfile, updateProfile, getUserPosts} = require('../controllers/userController');

// const auth = require("../middlewares/authMiddleware");
// const upload = require("../middlewares/uploadMiddleware");
// // const multer = require("multer");

// const router = express.Router();
// // const upload = multer({ dest: "uploads/" });

// router.get("/profile", auth, getProfile);
// router.put("/profile", auth, upload.single("profilePic"), updateProfile);
// router.get("/profile-posts", auth, getUserPosts);

// module.exports = router;


const express = require("express");
const { 
  getProfile, 
  updateProfile, 
  getUserPosts, 
  getUserById, 
  searchUsers 
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

module.exports = router;
