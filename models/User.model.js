const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: String,
    email: String,
    password: String,
    ava: String
})

const userModel = mongoose.model('Users', userSchema)

module.exports = userModel
