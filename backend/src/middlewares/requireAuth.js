const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).send({ error: 'Необходимо авторизоваться.' })
    }

    const token = authorization.replace('Bearer ', '');

    jwt.verify(token, /*TODO заменить на переменную окружения*/'SECRET_KEY', async (err, payload) => {
        if (err) {
            return res.status(401).send({ error: 'Необходимо авторизоваться.' })
        }

        const { userId } = payload;
        const user = await User.findById(userId);
        req.user = user;
        next();
    });
}