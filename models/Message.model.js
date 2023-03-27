const mongoose = require('mongoose')
const Schema = mongoose.Schema

const messageSchema = new Schema({
    local_id: String,
    room_id: String,
    user_id: String,
    text: String,
    status: Number,
    time: String
}, {
    timestamps: true
})

const messageModel = mongoose.model('Messages', messageSchema)

module.exports = messageModel
