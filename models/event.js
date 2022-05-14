const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
const Event = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    emoji:{
        type:String,
        required:true
    },
    triggeredOn:{
        type:Date,
        required:true
    }
},{timestamps:true})

Event.plugin(uniqueValidator);
module.exports = mongoose.model('Event',Event);