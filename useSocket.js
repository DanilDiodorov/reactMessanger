const socketIo = require('socket.io')
const Message = require('./models/Message.model')

let io

function useSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    })

    io.on('connection', (client) => {
        console.log('Connected!')
        client.on('message', message => {
            const newMessage = new Message({
                local_id: message.local_id,
                room_id: message.room_id,
                user_id: message.user_id,
                text: message.text,
                status: 1,
                time: message.time
            })
            newMessage.save().then(data => {
                io.emit('newMessage', data)
                io.emit('updateStatus', data)
            })
        })
        client.on('here', message_id => {
            Message.findByIdAndUpdate(message_id, {
                status: 2
            }).then(data => {
                data.status = 2
                io.emit('updateStatus', data)
            })
        })
        client.on('readed', message_id => {
            Message.findByIdAndUpdate(message_id, {
                status: 3
            }).then(data => {
                data.status = 3
                io.emit('updateStatus', data)
            })
        })
        client.on('disconnect', () => {
            console.log('disconnected')
        })
    })
}

module.exports = [useSocket, io]
