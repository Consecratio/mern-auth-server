const router = require('express').Router()
const db = require('../../models')
const jwt = require('jsonwebtoken')
const authLockedRoute = require('./authLockedRoute.js')



router.get('/', async (req, res) => {
    try {
        console.log('test post route')
        const posts = await db.Post.find()
        res.json(posts)
        console.log(posts)
    } catch (err) {
        console.log(`failed to find all`, err)
        res.status(500).json({ msg: 'Internal Server Error, failed to find posts' })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const post = await db.Post.findById(req.params.id)
        res.json(post)
        console.log(post)
    } catch (err) {
        console.log(`failed to find one`, err)
        res.status(500).json({ msg: 'Internal Server Error, failed to find one' })
    }
})

router.post('/new', authLockedRoute, async (req, res) => {
    try {
        const newPost = new db.Post({
            user_id: req.body.user_id,
            title: req.body.title,
            tags: req.body.tags,
            content: req.body.content,
            max_attendees: req.body.max_attendees,
            attendees: req.body.attendees,
            event_date: req.body.event_date,
            event_time: req.body.event_time,
            address: req.body.address,
            img_url: req.body.img_url
        })
        await newPost.save()
        console.log('new post:', newPost)
        res.json(newPost)
    } catch (err) {
        console.log(`failed to create new post`, err)
        res.status(500).json({ msg: 'Internal Server Error, failed to create a new post' })
    }
})

router.put('/:id', authLockedRoute, async (req, res) => {
    try {
        const posts = await db.Post.findById(req.params.id)
        req.body.title = posts.title
        req.body.tags = posts.tags
        req.body.content = posts.content 
        req.body.max_attendees = posts.max_attendees
        req.body.event_date = posts.event_date
        req.body.event_time = posts.event_time
        req.body.address = posts.address
        req.body.img_url = posts.img_url


        posts.save()
        console.log(posts)
        res.json(posts)
    } catch (err) {
        console.log(`failed to update`, err)
        res.status(500).json({ msg: 'Internal Server Error, failed to update post' })
    }
})

// router.post('/join/:id', async (req, res) => {
//     try {
//         const join = await db.Post.findById(req.params.id)
//         join.attendees.push()
//     }
// })

router.delete('/:id', authLockedRoute, async (req, res) => {
    try {
        const post = await db.Post.findByIdAndDelete(req.params.id)
    } catch (err) {
        console.log(`failed to delete`, err)
        res.status(500).json({msg: 'Internal Server Error, failed to delete post'})
    }
})




module.exports = router