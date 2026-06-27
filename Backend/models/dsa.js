const mongoose = require("mongoose");

const dsaSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    company: {
      type: String,
      required: true,
    },

    topic: String,
    difficulty: String,

    questions: [
      {
        question: String,
        topic: String,
        difficulty: String,
        exampleInput: String,
        exampleOutput: String,
        hint: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.DSA || mongoose.model("DSA", dsaSchema);