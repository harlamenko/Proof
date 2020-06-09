const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const advertSchema = new Schema({
  /** Идентификатор владельца устройства */
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  /** Название устройства */
  name: { type: String, maxlength: 128, required: true },
  /** Дата публикации */
  publication_date: { type: Date, default: Date.now },
  /** Цена */
  price: Number,
  /** Город, в котором будет сделка */
  city: { type: String, maxlength: 128, required: true },
  /** Модель телефона */
  model_name: { type: String, required: true },
  /** Идентификатор сборки */
  build_id: { type: String, unique: true, required: true },
  /** Производитель */
  brand_name: { type: String, required: true },
  /** Год производства */
  year_class: { type: Number, required: true },
  /** Название операционной системы */
  os_name: { type: String, required: true },
  /** Описание продукта */
  description: String,
  /** Фотографии устройства */
  photos: [
    new Schema({
      photo: { type: String, required: true },
    }),
  ],
});

mongoose.model("Advert", advertSchema);
module.exports = advertSchema;
