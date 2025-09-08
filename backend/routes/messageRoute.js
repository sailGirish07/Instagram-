const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const {
  sendMessage,
  getConversations,
  getChat,
} = require("../controllers/messageController");

router.post("/:receiverId", auth, sendMessage);
router.get("/conversations", auth, getConversations);
router.get("/:userId", auth, getChat);

module.exports = router;
