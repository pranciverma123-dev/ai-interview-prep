const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      required: false,
    },

    communication: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },

    technical: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },

    confidence: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },

    overall: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },

    strengths: [
      {
        type: String,
      },
    ],

    improvements: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Feedback",
  feedbackSchema
);