const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { errorHandler } = require("./middleware/error");

const userRoutes = require("./routes/user");
const interviewRoutes = require("./routes/interview");
const aiRoutes = require("./routes/ai");
const dsaRoutes = require("./routes/dsa");
const atsRoutes = require("./routes/ats");

const app = express();

// ✅ CORS FIXED FOR PRODUCTION
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ✅ MONGODB CONNECTION (OK FOR NOW)
mongoose
  .connect(
    "mongodb+srv://pranciverma123_db_user:1ByDHWG3KxHyPP7n@cluster0.4locgwt.mongodb.net/aii?retryWrites=true&w=majority"
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

// Routes
app.use("/user", userRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api", dsaRoutes);
app.use("/api/ats", atsRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("Server Running");
});

// Error handler
app.use(errorHandler);

// ✅ PORT FIX FOR RENDER
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server Started on Port ${PORT}`);
});