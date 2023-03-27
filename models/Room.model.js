const mongoose = require('mongoose')
const Schema = mongoose.Schema

const roomSchema = new Schema({
    user_1: String,
    user_2: String,
    time: Number
})

const roomModel = mongoose.model('Rooms', roomSchema)

module.exports = roomModel
