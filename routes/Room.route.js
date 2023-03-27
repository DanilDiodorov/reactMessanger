const router = require('express').Router()
const Room = require('../models/Room.model')

router.post('/add', (req, res) => {
    const user_1 = req.body.user_1
    const user_2 = req.body.user_2
    const time = Date.now()

    const newRoom = new Room({
        user_1,
        user_2,
        time
    })

    newRoom.save().then(data => {
        return res.json(data)
    })
})
router.get('/find/:id', (req, res) => {
    const id = req.params.id

    Room.find({
        $or: [
            {user_1: id},
            {user_2: id}
        ]
    }).then(data => {
        if (data.length > 0){
            return res.json(data)
        }
        else {
            return res.json(false)
        }
    })
})

router.get('/time/:id', (req, res) => {
    const room_id = req.params.id

    Room.findByIdAndUpdate(room_id, {
        time: Date.now()
    })
        .then(() => {
            return res.json(true)
        })
})

module.exports = router
