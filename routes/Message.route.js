const router = require('express').Router()
const Message = require('../models/Message.model')
const [useSocket, io] = require('../useSocket')

router.get('/findlast/:room_id', (req, res) => {
    const room_id = req.params.room_id

    Message.find({
        room_id
    })
        .sort({$natural: -1})
        .limit(1)
        .then(data => {
            if (data.length > 0){
                return res.json(data)
            }
            else {
                return res.json(false)
            }
        })
})
router.post('/find', (req, res) => {
    const room_id = req.body.room_id
    const skip = req.body.skip
    const limit = req.body.limit

    Message.find({
        room_id
    })
        .sort({ $natural: -1})
        .skip(skip)
        .limit(limit)
        .then(data => {
            if (data.length > 0){
                return res.json(data.reverse())
            }
            else {
                return res.json(false)
            }
        })
        .catch(() => {
            return res.json(false)
        })
})
router.post('/unreaded', (req, res) => {
    const room_id = req.body.room_id
    const user_id = req.body.user_id

    Message.find({
        $or: [
            {   
                room_id,
                user_id,
                status: 1
            },
            {
                room_id,
                user_id,
                status: 2
            }
        ]
    })
    .then(data => {
        for (let i = 0; i < data.length; i++){
            if (data[i].status === 1){
                Message.findByIdAndUpdate(data[i]._id, {
                    status: 2
                })
                .then()
            }
        }
        if (data.length > 0){
            return res.json(data)
        }
        else {
            return res.json(false)
        }
    })
    .catch(() => {
        return res.json(false)
    })
})

module.exports = router
