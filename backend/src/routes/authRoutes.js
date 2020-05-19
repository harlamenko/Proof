const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = mongoose.model('User');

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = new User({ email, password });
        await user.save();
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);

        res.send({ token, user: { id: user._id, email } });
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

        res.send({ token, user: { id: user._id, email } });
    } catch (err) {
        return res.status(422).send({ error: 'Неправильный email или пароль.' });
    }

});

module.exports = router;
