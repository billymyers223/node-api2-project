// implement your posts router here
const express = require('express')
const Post = require('./posts-model')
const router = express.Router()

router.get('/', async (req,res)=>{
    
        try{
            const posts = await Post.find()
            res.status(200).json(posts)
        }
        catch{
            console.log('error')
            res.status(500).json({
                message:'Error retrieving posts',
            })
        }
})
module.exports = router