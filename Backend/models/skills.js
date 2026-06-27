const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    
    role: {
      type: String,
      required: true,
      trim: true,
    },

    // (Optional reference data for AI generation)
    questions: [
      {
        question: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ["mcq", "code", "text"],
          default: "text",
        },
        options: {
          type: [String],
          default: [],
        },
        answer: {
          type: String,
          default: "",
        },
      },
    ],

    skills: [
      {
        name: {
          type: String,
          required: true,
        },
        level: {
          type: String,
          enum: ["easy", "medium", "hard"],
          default: "medium",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Skill", skillSchema);