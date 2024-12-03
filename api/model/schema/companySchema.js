const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String, require: true },
  type: { type: String },
  categories: [
    { type: String }
  ],
  vector:[{type:Number}]
}, { timestamps: true });

module.exports = companySchema;