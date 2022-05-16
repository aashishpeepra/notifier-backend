const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const User = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name:{
      type:String
    },
    deviceId: {
      type: String,
    },
    clientId: {
      type: String,
    },
    clientSecret: {
      type: String,
    },
    eventsCount: {
      type: Number,
      default:0
    },
    tokenDeletedCount:{
        type:Number,
        default:0
    },
    events: [
      {
        type: mongoose.Types.ObjectId,
        ref:"Event"
      },
    ],

  },
  { timestamps: true }
);

User.plugin(uniqueValidator);

module.exports = mongoose.model('User',User);