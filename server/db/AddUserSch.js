const mongoose = require ('mongoose');

const  AddUserSchSchema = new mongoose.Schema({
    name:String,
    phone:String,
    email:String,
    password:String
})

module.exports = mongoose.model("newusers",AddUserSchSchema)