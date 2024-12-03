const mongoose = require("mongoose");

const questionsSchema = new mongoose.Schema(
  {
    conversitionid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "conversition",
      require: true,
    },
    important: { type: String },
    input_type: { type: String },
    options: [{ type: String }],
    question: { type: String },
    disable: { type: Boolean, default: false },
    answer: { type: String },
  },
  { timestamps: true }
);

module.exports = questionsSchema;
