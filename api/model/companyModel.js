const mongoose = require("mongoose");
const companySchema = require("./schema/companySchema");
module.exports = mongoose.model("companies", companySchema);