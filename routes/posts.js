const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User')
const cloudinary = require('../utils/cloudinary')

const router = express.Router();

//create a post
router.post('/', async (req, res) => {
    const { img } = req.body;
    try {
        if (img) {
            const uploadRes = await cloudinary.uploader.upload(img, {
                upload_preset: "socialApp"
            });

            if (uploadRes) {
                req.body.img = uploadRes;
                const post = new Post(req.body);
                await post.save();
                res.status(200).send("Post Uploaded Successfully");
            }
        }
        else {
            const post = new Post(req.body);
            await post.save();
            res.status(200).send("Post Uploaded Successfully");
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});

//update a post
router.put('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body });
            res.status(200).json('Post has been updated.')
        }
        else {
            res.status(403).json('you can update only your post.')
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
});

//delete a post
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json("Post has been deleted.")
        }
        else {
            res.status(403).json('you can delete only your post.')
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
})

//like a post / dislike a post
router.put('/:id/like', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).json("Liked.");
        }
        else {
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json("Disliked.");
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
});

//get a post
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    }
    catch (err) {
        res.status(500).json(err);
    }
});

// get timeline posts
router.get('/timeline/:userId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({ userId: currentUser._id });
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({ userId: friendId })
            })
        );
        res.status(200).json(userPosts.concat(...friendPosts));
    }
    catch (err) {
        res.status(500).json(err);
    }
});
// get user's all posts
router.get('/profile/:userId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({ userId: currentUser._id });
        res.status(200).json(userPosts);
    }
    catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;