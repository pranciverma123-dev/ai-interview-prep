require("dotenv").config();

console.log("GROQ:", process.env.GROQ_API_KEY);
console.log("MONGO:", process.env.MONGO_URI);

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


// ✅ CORS CONFIGURATION
const allowedOrigins = [
  "http://localhost:3000",
  "https://ai-interview-prep-omega-coral.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization"
    ]
  })
);

app.options("*", cors());


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));


// Routes
app.use("/user", userRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api", dsaRoutes);
app.use("/api/ats", atsRoutes);


// Health Check
app.get("/", (req, res) => {
  res.send("Server Running");
});


// Error Handler
app.use(errorHandler);


// PORT FOR RENDER
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server Started on Port ${PORT}`);
});