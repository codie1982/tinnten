const mongoose = require("mongoose");

const conversitionSchema = new mongoose.Schema({
  conversitionid: { type: Number },
  procedure:{type:String,require:true},
  expert_suggest: { type: String },
  profession:[{type:String}],
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "question",
      require: true,
    }
  ],
  conversition:[
    {
      system_response:{ type: mongoose.Schema.Types.Mixed },
      human_message:{type:String},
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  suggest:{
    services:[{ type: String }],
    products:[{ type: String }],
  },
}, { timestamps: true });

module.exports = conversitionSchema;