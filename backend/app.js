const express = require("express");
const connectDb = require("./config/db");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Connect DB
connectDb();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // frontend
    credentials: true,
  })
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/posts", require("./routes/postRoutes"));
app.use("/messages", require("./routes/messageRoute"));
app.use("/notifications", require("./routes/notificationRoutes"));

// Route not found
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Server error", error: err.message });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
