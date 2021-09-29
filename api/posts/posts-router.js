// implement your posts router here
const express = require('express')
const Posts = require('./posts-model')
const router = express.Router()

router.get('/', (req, res)=>{
    Posts.find(req.query)
        .then(posts =>{
            res.status(200).json(posts)
        })
        .catch(err=>{
            res.status(500).json({
                message: "The posts information could not be retrieved",
                error: err.message
            })
        })
})


router.get('/:id', (req, res)=>{
    Posts.findById(req.params.id)
        .then(post =>{
            if(post){
                res.status(200).json(post)
            }else{
                res.status(404).json({ 
                    message: "The post with the specified ID does not exist" })
            }
        })
        .catch(err=>{
            res.status(500).json({
                message: "The post information could not be retrieved",
                error: err.message
            })
        })
})


router.post('/', (req, res)=>{
    const {title, contents} = req.body
    if(title && contents){
        Posts.insert({title, contents})
            .then(({id}) =>{
                return Posts.findById(id)
            })
            .then(post=>{
                res.status(201).json(post)
            })
            .catch(err=>[
                res.status(500).json({
                     message: "There was an error while saving the post to the database",
                     error: err.message
                })
            ])
    }else{
        res.status(400).json({
            message: "The post with the specified ID does not exist" 
        })
    }
})


router.put('/:id', (req, res)=>{
    const {title, contents} = req.body
    if(!title || !contents){
        res.status(400).json({
            message: "Please provide title and contents for the post"
        })
    }else{
        Posts.findById(req.params.id)
            .then(id=>{
                if(!id){
                    res.status(404).json({
                        message: "The post with the specified ID does not exist"
                    })
                }else{
                    return Posts.update(req.params.id, req.body)
                }
            })
            .then(data=>{
                if(data){
                    return Posts.findById(req.params.id)
                }
            })
            .then(post=>{
                if(post){
                    res.json(post)
                }
            })
            .catch(err=>[
                res.status(500).json({
                    message: "The post information could not be modified",
                    error: err.message
                })
            ])
    }
})

router.delete('/:id', async (req, res)=>{
    try{
        const post = await Posts.findById(req.params.id)
        if(post){
            await Posts.remove(req.params.id)
            res.json(post)
        }else{
            res.status(404).json({ 
                message: "The post with the specified ID does not exist" })
        }
    }catch(err){
            res.status(500).json({
                message: "The post could not be removed",
                error: err.message
            })
    }
})

router.get('/:id/comments', async (req, res)=>{
    try{
        const post = await Posts.findById(req.params.id)
        if(post){
            const message = await Posts.findPostComments(req.params.id)
            res.json(message)
        }else{
            res.status(404).json({
                message: "The post with the specified ID does not exist" 
            })
        }
    }catch(err){
        res.status(500).json({
            message: "The comments information could not be retrieved",
            error: err.message
        })
    }
})

module.exports = router
