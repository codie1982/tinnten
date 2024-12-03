const mongoose = require("mongoose");
const conversitionSchema = require("./schema/conversitionSchema");
module.exports = mongoose.model("conversition", conversitionSchema);