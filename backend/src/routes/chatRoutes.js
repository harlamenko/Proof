const chatRouter = require("express").Router();
const mongoose = require("mongoose");
const Message = mongoose.model("Message");
const Conversation = mongoose.model("Conversation");
const requireAuth = require("../middlewares/requireAuth");

chatRouter.use(requireAuth);
/**
 * GET - Для получения всех диалогов
 */
chatRouter.route("/conversations").get(async (req, res) => {
  const from = req.user._id.toString();

  try {
    const conversations = await Conversation.find(
      { $or: [{ buyer: from }, { seller: from }] },
      "-__v",
      {
        sort: { updated_at: -1 },
        populate: [
          { path: "seller", select: "-__v -password" },
          { path: "buyer", select: "-__v -password" },
          { path: "advert", select: "-__v" },
        ],
      }
    );

    res.send(conversations);
  } catch (err) {
    console.error(err);
    res.status(500).send("Не удалось получить все диалоги.");
  }
});
/**
 * GET - Для получения всех cообщений
 * POST - Публикует сообщение и делает его рассылку в диалог и список диалогов
 * PUT - "Прочитывает" сообщение и обновляет его состояние и состояние диалога
 *
 * @param {cid} - идентификатор диалога
 */
chatRouter
  .route("/conversation/:cid")
  .get(async (req, res) => {
    const {
      params: { cid },
    } = req;

    try {
      const messages = await Message.find({ conversation: cid }, "-__v", {
        sort: { createdAt: -1 },
        populate: [{ path: "user", select: "-__v -password" }],
      });

      res.send({ messages });
    } catch (err) {
      console.error(err);
      res.status(500).send("Не удалось получить сообщения.");
    }
  })
  .post(async (req, res) => {
    try {
      const {
        user,
        io,
        params: { cid },
        body: {
          seller,
          buyer,
          advert,
          msg: { text, conversation, image },
        },
      } = req;
      const from = user._id.toString();
      const myCompanion = from === seller._id ? buyer._id : seller._id;
      const msgBody = { text, conversation, image, user: from, read: false };
      const socketMsgBody = {
        ...msgBody,
        _id: Math.random().toString(),
        createdAt: Date.now(),
      };
      const conversationId = conversation || cid;
      const advertInfo = { seller, buyer, advert };
      const convUpdate = {
        last_message: text || "Изображение",
        updated_at: socketMsgBody.createdAt,
        $inc: { unread_count: 1 },
      };
      const convOptions = {
        new: true,
        populate: [
          { path: "seller", select: "-__v -password" },
          { path: "buyer", select: "-__v -password" },
          { path: "advert", select: "-__v" },
        ],
      };
      let c = null;

      if (conversationId !== "null") {
        // рассылка в диалог
        io.emit(`${from}${conversationId}`, socketMsgBody);

        c = await Conversation.findByIdAndUpdate(
          conversationId,
          convUpdate,
          convOptions
        );
      } else {
        c = await Conversation.findOneAndUpdate(
          advertInfo,
          { ...advertInfo, ...convUpdate },
          { ...convOptions, upsert: true }
        );

        io.emit(`${from}${c._id}`, socketMsgBody); // рассылка в диалог
      }

      io.emit(myCompanion, c); // рассылка в список диалогов
      await Message.create({ ...msgBody, conversation: c._id });
      res.send({ message: "Сообщение сохранено!", conversationId: c._id });
    } catch (err) {
      console.error(err);
      res.status(500).send("Не удалось обновить диалог.");
    }
  })
  .put(async (req, res) => {
    try {
      const {
        params: { cid },
        body: { messageIds },
      } = req;

      const msgs = await Message.updateMany(
        { _id: { $in: messageIds }, conversation: cid },
        { read: true }
      );
      await Conversation.findByIdAndUpdate(cid, {
        $inc: { unread_count: -msgs.nModified },
      });

      res.send(`Сообщения ${messageIds.join(" ")} прочитаны.`);
    } catch (err) {
      console.error(err);
      res.status(500).send("Не удалось прочитать сообщения.");
    }
  });
/**
 * GET - Для получения диалога при переходе с детализации
 *
 * @param {seller} - идентификатор продавца
 * @param {advert} - идентификатор объявления
 * @param {buyer} - идентификатор покупателя
 */
chatRouter
  .route("/conversation/:seller/:advert/:buyer")
  .get(async (req, res) => {
    const {
      params: { seller, advert, buyer },
    } = req;

    try {
      const conversation = await Conversation.findOne(
        { seller, advert, buyer },
        "-__v",
        {
          populate: [
            { path: "seller", select: "-__v -password" },
            { path: "buyer", select: "-__v -password" },
            { path: "advert", select: "-__v" },
          ],
        }
      );

      res.send(conversation);
    } catch (err) {
      console.error(err);
      res.status(500).send("Ошибка получения информации о диалоге.");
    }
  });

module.exports = chatRouter;
