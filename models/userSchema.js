const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    "email": {type:String},
    "password": {type:String},
    "firstLogin": {type:Boolean, default: true},
    "budget": {type:Number},
    "balance": {type:Number},
    "expenditures": {
        type: [Number],
        default: Array.from({ length: 14 }, () => 0), 
    },
    "transactions": [
        {
            date: { type: String },
            time: { type: String },
            value: { type: Number },
            category: { type: String },
            option: { type: String },
        }
    ],
    "date": {type:String},
}, {
    collection: "users"
})

module.exports = mongoose.model("userSchema", userSchema);