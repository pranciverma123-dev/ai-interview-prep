const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { errorHandler } = require("./middleware/error");

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const userRoutes = require("./routes/user");

const interviewRoutes = require("./routes/interview");
const aiRoutes = require("./routes/ai");
const dsaRoutes = require("./routes/dsa");
const atsRoutes = require("./routes/ats");
const resumeRoutes = require("./routes/ats");


const app = express();



app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());



mongoose
  .connect("mongodb://127.0.0.1:27017/aii")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));



app.use("/user", userRoutes);

app.use("/api/interview", interviewRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api", dsaRoutes);
app.use("/api/ats", atsRoutes);
app.use("/api/resume", resumeRoutes);

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server Started on Port ${PORT}`);
});