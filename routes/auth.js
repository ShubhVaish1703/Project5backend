//LOGIN AND REGISTER ROUTE
const bcrypt = require('bcrypt');
const Joi = require('joi');
const express = require('express');
const User = require('../models/User');


const router = express.Router();
//login
router.post('/login', async (req, res) => {
    //validate the data
    const schema = Joi.object({
        email: Joi.string().min(3).max(200).required().email(),
        password: Joi.string().min(6).max(200).required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        res.status(400).send(error.details[0].message)
    }

    //find the user by email
    let user = await User.findOne({ email: req.body.email });
    if (!user) { //if user does not exist
        return res.status(400).send("Invalid email or password..")
    }

    //checking the password
    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) {
        return res.status(400).send("Invalid email or password..");
    }

    res.send(user);
});

//register
router.post('/register', async (req, res) => {
    //validate the data
    const schema = Joi.object({
        username: Joi.string().min(3).max(100).required(),
        email: Joi.string().min(3).max(200).required().email(),
        password: Joi.string().min(6).max(200).required(),
        profilePicture:Joi.string(),
        coverPicture:Joi.string(),
        followers:Joi.array(),
        followings:Joi.array(),
        isAdmin:Joi.boolean(),
        desc:Joi.string(),
        city:Joi.string(),
        from:Joi.string(),
        relationship:Joi.number(),
    });
    const { error } = schema.validate(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    //check whether the user already exists by email
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).send("Email already exists..")
    }

    //check whether the user already exists by username
    user = await User.findOne({ username: req.body.username });
    if (user) {
        return res.status(400).send("Username already exists..")
    }

    //  creating new user
    user = new User(req.body)

    //hashing the password
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(user.password, salt)
    //saving the user
    user = await user.save();

    res.send("User Registered Successfully.");
})

module.exports = router;