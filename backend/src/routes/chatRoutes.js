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
            { $or: [{ buyer: from }, { seller: from }] },
            '-__v',
            {
                sort: { updated_at: -1 },
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
    // Публикует сообщение и делает его рассылку в диалог и список диалогов 
    .post(async (req, res) => {
        try {
            const {
                user, io, params: { cid },
                body: {
                    seller, buyer, advert,
                    msg: { text, conversation, image }
                }
            } = req;
            const from = user._id.toString();
            const myCompanion = from === seller._id ? buyer._id : seller._id;
            const msgBody = { text, conversation, image, user: from };
            const socketMsgBody = {
                ...msgBody,
                _id: Math.random().toString(),
                createdAt: Date.now()
            };
            const conversationId = conversation || cid;
            const advertInfo = { seller, buyer, advert };
            const convUpdate = {
                last_message: text || 'Изображение',
                updated_at: socketMsgBody.createdAt
            };

            if (conversationId !== 'null') {
                // публикация в диалог
                io.emit(`${from}${conversationId}`, socketMsgBody);
                // публикация в список диалогов
                io.emit(myCompanion, { _id: conversationId, ...convUpdate, ...advertInfo });

                await Conversation.findByIdAndUpdate(
                    conversationId, convUpdate, { new: true }
                );

                await Message.create(msgBody);
                res.send({ message: 'Сообщение сохранено!', conversationId });
            } else {
                const c = await Conversation.findOneAndUpdate(
                    advertInfo,
                    { ...advertInfo, ...convUpdate },
                    { new: true, upsert: true }
                );

                io.emit(`${from}${c._id}`, socketMsgBody); // публикация в диалог
                io.emit(myCompanion, c); // публикация в список диалогов

                await Message.create({ ...msgBody, conversation: c._id });
                res.send({ message: 'Сообщение сохранено!', conversationId: c._id });
            }
        } catch (err) {
            console.error(err);
            res.status(500).send('Не удалось обновить диалог.');
        }
    })
    .get(async (req, res) => { // Для получения всех cообщений
        const { params: { cid } } = req;

        try {
            // TODO: добавиль lazy loading
            const messages = await Message.find(
                { conversation: cid },
                '-__v',
                {
                    sort: { createdAt: -1 },
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