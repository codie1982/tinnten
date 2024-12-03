const mongoose = require("mongoose");
const questionSchema = require("./schema/questionsSchema");
module.exports = mongoose.model("questions", questionSchema);