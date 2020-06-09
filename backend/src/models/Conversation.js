const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
  /** Продавец устройства */
  seller: { type: Schema.Types.ObjectId, ref: "User" },
  /** Покупатель устройства */
  buyer: { type: Schema.Types.ObjectId, ref: "User" },
  /** Устройство, по которому ведется диалог */
  advert: { type: Schema.Types.ObjectId, ref: "Advert" },
  /** Текст последнего сообщения */
  last_message: { type: String },
  /** Дата обновления */
  updated_at: { type: Date, default: Date.now },
  /** Кол-во непрочитанных сообщений в диалоге */
  unread_count: { type: Number, default: 0, min: 0 },
});

mongoose.model("Conversation", conversationSchema);
module.exports = conversationSchema;
