const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const cors = require('cors')

const app = express()
const server = require('http').createServer(app)
const [useSocket] = require('./useSocket')

useSocket(server)

const PORT = process.env.PORT || config.get('PORT')
const URI = config.get('URI')

app.use(cors())
app.use(express.json())

const userRoute = require('./routes/User.route')
const roomRoute = require('./routes/Room.route')
const messageRoute = require('./routes/Message.route')

app.use('/user', userRoute)
app.use('/room', roomRoute)
app.use('/message', messageRoute)

app.use(express.static('client/build'))

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
})



mongoose.connect(URI, {
    useCreateIndex: true,
    useFindAndModify: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('DB is connected')
        server.listen(PORT, () => {
            console.log('Server is running on port ' + PORT)
        })
    })


