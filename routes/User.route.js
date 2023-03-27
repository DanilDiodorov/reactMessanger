const router = require('express').Router()
const User = require('../models/User.model')

router.post('/add', (req, res) => {
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password
    const ava = req.body.ava || ''

    const newUser = new User({
        username,
        email,
        password,
        ava
    })

    newUser.save().then(data => {
        return res.json(data._id)
    })
})

router.post('/login', (req, res) => {
    const email = req.body.email
    const password = req.body.password

    User.find({
        email,
        password
    })
        .then(data => {
            if (data.length > 0){
                return res.json(data[0]._id)
            }
            else {
                return res.json(false)
            }
        })
})

router.get('/friend/:id',(req, res) => {
    const id = req.params.id

    User.findById(id).then(data => {
        return res.json({id: data._id, email: data.email, username: data.username, ava: data.ava})
    })
})

router.post('/check', async (req, res) => {
    const email = req.body.email
    const username = req.body.username

    const findEmail = await User.find({email})
    if (findEmail.length > 0){
        return res.json('Такой email уже существует')
    }
    const findUsername = await User.find({username})
    if (findUsername.length > 0){
        return res.json('Такое имя пользователя уже существует')
    }
    return res.json(true)
})

router.get('/profile/:id', (req, res) => {
    const id = req.params.id

    User.findById(id)
        .then(data => {
            return res.json(data)
        })
})

router.get('/addcheck/:id', (req, res) => {
    const id = req.params.id

    User.findById(id)
        .then(() => {
            return res.json(true)
    })
        .catch(() => {
            return res.json(false)
        })
})

module.exports = router
