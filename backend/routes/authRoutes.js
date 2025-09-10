const express = require("express");
const {
  signup,
  login,
  forgotPassword,
} = require("../controllers/authControllers");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-pass", forgotPassword);

module.exports = router;
