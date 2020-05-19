const chatRouter = require('express').Router();
const mongoose = require('mongoose');
const Message = mongoose.model('Message');
const Conversation = mongoose.model('Conversation');
const requireAuth = require('../middlewares/requireAuth');

chatRouter.use(requireAuth);

const saveMesssage = async (body, res) => {
    const message = new Message(body);

    try {
        await message.save();
        res.send({ message: 'Сообщение сохранено!', conversationId: body.conversation });
    } catch (err) {
        console.error(err);
        res.status(500).send('Не удалось сохранить сообщение.');
    }
}
/**
 * Для инициализации диалога. 
 * Вызывается при отправке первого сообщения, чтобы определить роли.
 */
const initConversation = async ({ user, body: { to, text, image, advert } }, res) => {
    try {
        const from = user._id.toString();
        const c = new Conversation({
            advert,
            seller: to,
            buyer: from,
            last_message: text || 'Изображение'
        });

        await c.save();

        // TODO: req.io.sockets.emit('messages', body);

        saveMesssage({ user: from, conversation: c._id, text, image, advert }, res);

    } catch (err) {
        console.error(err);
        res.status(500).send('Не удалось создать диалог.');
    }
}
/**
 * Публикует сообщение и обновляет состояние диалога
 */
const pubMessage = async ({ user, params: { cid }, body: { text, image } }, res) => {
    try {
        const from = user._id.toString();
        // const conversation = await Conversation.findOneAndUpdate(
        //     { $or: [{ recipients: [from, to] }, { recipients: [to, from] }] },
        //     {
        //         recipients: [from, to],
        //         lastMessage: body.text || 'Изображение',
        //         updated_at: Date.now()
        //     },
        //     { upsert: true, new: true, setDefaultsOnInsert: true }
        // );

        //TODO: req.io.sockets.emit('messages', body);

        // TODO: проверить нужно ли ждать Upd Conversation 
        await Conversation.findByIdAndUpdate(
            cid,
            {
                lastMessage: text || 'Изображение',
                updated_at: Date.now()
            },
            { new: true }
        );

        saveMesssage({ user: from, conversation: cid, text, image, }, res);
    } catch (err) {
        console.error(err);
        res.status(500).send('Не удалось обновить диалог.');
    }
}
/**
 * Для получения всех cообщений
 */
const getMessages = async ({ params: { cid } }, res) => {
    try {
        // TODO: добавиль lazy loading
        const messages = await Message.find({ conversation: cid }).select('-__v').sort({ createdAt: -1 });
        res.send({ messages });
    } catch (err) {
        console.error(err);
        res.status(500).send('Не удалось получить сообщения.');
    }
};

// chatRouter.route('/conversations')
//     /** Для получения всех диалогов */
//     .get(async (req, res) => {
//         const from = req.user._id.toString();

//         try {
//             const conversations = await Conversation.find(
//                 { recipients: { $all: [from] } },
//                 '-__v',
//                 { populate: { path: 'recipients', select: '-__v -password' } }
//             );

//             res.send(conversations);
//         } catch (err) {
//             console.error(err);
//             res.status(500).send('Не удалось получить все диалоги.');
//         }
//     });
/** Диалоги */
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
 * Инициация диалога
 * 
 * @param {uid} - идентификатор продавца
 */
chatRouter.route('/conversation/init').post(initConversation);
/**
 * API диалога
 * 
 * @param {uid} - идентификатор диалога
 */
chatRouter.route('/conversation/:cid')
    .post(pubMessage) // Публикация сообщения
    .get(getMessages);// Получение всех cообщений


module.exports = chatRouter;
