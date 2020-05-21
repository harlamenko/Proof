const chatRouter = require('express').Router();
const mongoose = require('mongoose');
const Message = mongoose.model('Message');
const Conversation = mongoose.model('Conversation');
const requireAuth = require('../middlewares/requireAuth');

chatRouter.use(requireAuth);

chatRouter.route('/conversations').get(async (req, res) => {
    const from = req.user._id.toString();

    try {
        const conversations = await Conversation.find(
            { $or: [{ ['buyer']: from }, { ['seller']: from }] },
            '-__v',
            {
                sort: { 'updated_at': -1 },
                populate: [
                    { path: 'seller', select: '-__v -password' },
                    { path: 'buyer', select: '-__v -password' },
                    { path: 'advert', select: '-__v' }
                ]
            }
        );

        res.send(conversations);
    } catch (err) {
        console.error(err);
        res.status(500).send('Не удалось получить все диалоги.');
    }
});
/**
 * Диалог
 * 
 * @param {cid} - идентификатор диалога
 */
chatRouter.route('/conversation/:cid')
    .post(async (req, res) => { // Публикует сообщение и обновляет состояние диалога
        const {
            user, io,
            body: {
                seller, buyer, advert,
                msg: { text, conversation, image }
            },
            params: { cid }
        } = req;

        try {
            const from = user._id.toString();

            if (`${conversation}` !== 'null' || cid !== 'null') {
                const room = `${conversation || cid}${seller === from ? buyer : seller}`

                // io.to(room).emit('messages', { text, conversation, image });

                await Conversation.findByIdAndUpdate(
                    conversation || cid,
                    {
                        last_message: text || 'Изображение',
                        updated_at: Date.now()
                    },
                    { new: true }
                );

                await Message.create({ user: from, conversation, text, image });

                res.send({ message: 'Сообщение сохранено!', conversationId: conversation });
            } else {
                const c = await Conversation.findOneAndUpdate(
                    { seller, buyer, advert },
                    {
                        seller,
                        buyer,
                        advert,
                        last_message: text || 'Изображение',
                        updated_at: Date.now()
                    },
                    { new: true, upsert: true }
                );

                const room = `${c._id}${seller === from ? buyer : seller}`

                // io.to(room).emit('messages', { text, conversation, image });

                await Message.create({
                    user: from,
                    conversation: c._id,
                    text, image,
                });

                res.send({ message: 'Сообщение сохранено!', conversationId: c._id });
            }
        } catch (err) {
            console.error(err);
            res.status(500).send('Не удалось обновить диалог.');
        }
    })
    .get(async (req, res) => { // Для получения всех cообщений
        const { io, user, params: { cid } } = req;

        // io.join(`${cid}${user._id.toString()}`);

        try {
            // TODO: добавиль lazy loading
            const messages = await Message.find(
                { conversation: cid },
                '-__v',
                {
                    sort: { 'createdAt': -1 },
                    populate: [
                        { path: 'user', select: '-__v -password' }
                    ]
                }
            );

            res.send({ messages });
        } catch (err) {
            console.error(err);
            res.status(500).send('Не удалось получить сообщения.');
        }
    });

// для получения диалога при переходе с детализации
chatRouter.route('/conversation/:seller/:advert/:buyer').get(async (req, res) => {
    const { params: { seller, advert, buyer } } = req;

    try {
        const conversation = await Conversation.findOne(
            { seller, advert, buyer },
            '-__v',
            {
                populate: [
                    { path: 'seller', select: '-__v -password' },
                    { path: 'buyer', select: '-__v -password' },
                    { path: 'advert', select: '-__v' }
                ]
            }
        );

        res.send(conversation);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка получения информации о диалоге.');
    }
});


module.exports = chatRouter;
