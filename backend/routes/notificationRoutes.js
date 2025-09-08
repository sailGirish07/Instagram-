const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notificationController");

router.get("/", auth, getNotifications);
router.put("/:id/read", auth, markAsRead);
router.put("/mark-all-read", auth, markAllAsRead);

module.exports = router;
