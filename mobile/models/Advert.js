export class Advert {
    /** Идентификатор устройства */
    _id = null;
    get id() {
        return this._id;
    }
    /** Идентификатор владельца устройства */
    user_id = null;
    /** Название устройства */
    name = null;
    /** Дата публикации */
    publication_date = null;
    /** Цена */
    price = null;
    /** Город, в котором будет сделка */
    city = null;
    /** Модель телефона */
    model_name = null;
    /** Идентификатор сборки */
    build_id = null;
    /** Производитель */
    brand_name = null;
    /** Год производства */
    year_class = null;
    /** Название операционной системы */
    os_name = null;
    /** Описание продукта */
    description = null;
    /** Фотографии устройства */
    photos = [{ photo: null }]
    get photo() {
        return this.photos[0].photo;
    }
    get published_at() {
        return new Date(this.publication_date).toLocaleString();
    }

    constructor(obj) {
        if (obj instanceof Object) {
            Object.assign(this, obj);
        }
    }

    belongsTo(userId) {
        return this.user_id === userId;
    }

    getInfoForQR() {
        debugger;
        return '';
    }
}