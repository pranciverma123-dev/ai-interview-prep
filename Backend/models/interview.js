// const mongoose = require("mongoose");

// const interviewSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     role: {
//       type: String,
//       required: true,
     
//     },

//     questions: [
//       {
//         type: String,
//         required: true,
//       },
//     ],

//     answers: [
//       {
//         question: {
//           type: String,
//           required: true,
//         },

//         answer: {
//           type: String,
//           required: true,
//         },
//       },
//     ],

//     score: {
//       type: Number,
//       default: 0,
//       min: 0,
//       max: 100,
//     },

//     status: {
//       type: String,
//       enum: ["pending", "completed"],
//       default: "pending",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model(
//   "Interview",
//   interviewSchema
// );

const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    // Questions generated for interview
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

    // User submitted answers (IMPORTANT FIX HERE)
    answers: [
      {
        question: {
          type: String,
          required: true,
        },
        answer: {
          type: String,
          default: "",   // ❌ removed required:true
        },
        attempted: {
          type: Boolean,
          default: false,
        },
      },
    ],

    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Interview", interviewSchema);
// const mongoose = require("mongoose");

// const interviewSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     role: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     // ✅ FIXED: now stores full question objects
//     questions: [
//       {
//         question: {
//           type: String,
//           required: true,
//         },
//         type: {
//           type: String,
//           enum: ["mcq", "code", "text"],
//           default: "text",
//         },
//         options: {
//           type: [String],
//           default: [],
//         },
//         answer: {
//           type: String,
//           default: "",
//         },
//       },
//     ],

//     answers: [
//       {
//         question: {
//           type: String,
//           required: true,
//         },
//         answer: {
//           type: String,
//           required: true,
//         },
//       },
//     ],

//     score: {
//       type: Number,
//       default: 0,
//       min: 0,
//       max: 100,
//     },

//     status: {
//       type: String,
//       enum: ["pending", "completed"],
//       default: "pending",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("Interview", interviewSchema);