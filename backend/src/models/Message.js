const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    /** Идентификатор отправителя */
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    /** Идентификатор диалога */
    conversation: { type: Schema.Types.ObjectId, ref: 'Conversation' },
    /** Текст сообщения */
    text: { type: String, maxlength: 720 },
    /** Изображение */
    image: { type: String },
    /** Дата отправки */
    createdAt: { type: Date, default: Date.now },
});

mongoose.model('Message', messageSchema);
