const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');
const router = express.Router();
const requireAuth = require('../middlewares/requireAuth');

router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = new User({ email, password });
        await user.save();
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);

        res.send({
            token, user: {
                id: user._id,
                image: user.image,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        return res.status(422).send(error.message);
    }
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).send({ error: 'Необходимо передать email и пароль.' });
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(422).send({ error: 'Неправильный email или пароль.' });
    }

    try {
        await user.comparePassword(password);
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);

        res.send({
            token, user: {
                id: user._id,
                image: user.image,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        return res.status(422).send({ error: 'Неправильный email или пароль.' });
    }
});

router.post('/profile', requireAuth, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });
        user.password = null;
        res.send({
            id: user._id,
            image: user.image,
            name: user.name,
            email: user.email
        });
    } catch (error) {
        return res.status(422).send(error.message);
    }
});

module.exports = router;
