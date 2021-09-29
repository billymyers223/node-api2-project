// implement your posts router here
const express = require('express')
const Post = require('./posts-model')
const router = express.Router()

router.get('/', (req, res) =>{
    Post.find(req.query)
        .then( posts => {
           res.status(200).json(posts); 
        }).catch((err) => {
            console.log(err)
            res.status(500).json({
            message:'Error retrieving posts',
            })
        });
})

router.get('/:id', (req,res) =>{
    Post.findById(req.params.id)
        .then(Post =>{
            if(!Post){
                res.status(404).json({message: 'does not exist'})
                // res.status(200).json(Post)
            }else if(Post){
                // res.status(404).json({message: 'Post not found'})
                res.status(200).json(Post)
            }
        })
        .catch(err =>{
            console.log(err)
            res.status(500).json({
            message:'Error retrieving post by ID',
            })
        })
})

router.post('/', async (req,res) =>{
    try {
        if(req.body.title && req.body.contents) {
            const id = await Post.insert(req.body)
            res.status(201).json({...req.body, id})
        } else {
            res.status(400).json({
                message: "Please provide title and contents for the post"
            })
        }
    } catch (err) {
        res.status(500).json({
            message: "There was an error while saving the post to the database"
        })
    }

})

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const post = await Post.findById(id)
        if(!post) {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        } 
        else if(!req.body.title || !req.body.contents) { 
            res.status(400).json({
                message: "Please provide title and contents for the post"
            })
            } 
        else {
            await Post.update(id, req.body)
            const updatedPost = await Post.findById(id)
            res.status(200).json(updatedPost)
        }
        
    } 
    catch (err) {
        res.status(500).json({
            message: "The post information could not be modified"
        })
    }
})

router.delete('/:id', async (req,res) =>{
    try {
        const { id } = req.params
        const post = await Post.findById(id)
        if(post) {
            await Post.remove(id)
            res.status(200).json(post)

        } 
        else {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        }
    } catch (err) {
        res.status(500).json({
            message: "The post could not be removed"
        })
    }
})

router.get('/:id/comments', async(req,res) =>{
    try{
        const {id} = req.params
        const comments = await Post.findPostComments(id)
        if(comments.length >0){
            res.status(200).json(comments)
        }
        else{
            res.status(404).json({
                message: 'The post with the specified ID does not exist'
            })
        }
    }
    catch{
        res.status(500).json({
            message: 'The comments information could not be retrieved'
        })
    }
})


module.exports = router