import * as DeviceAPI from 'expo-device';

export class Advert {
    /** Идентификатор устройства */
    _id = null;
    get id() { return this._id; }
    /** Идентификатор владельца устройства */
    user_id = null;
    /** Название устройства */
    name = null;
    /** Дата публикации */
    publication_date = null;
    get published_at() {
        return new Date(this.publication_date).toLocaleString();
    }
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
    get photo() { return this.photos[0].photo; }

    constructor(val) {
        if (typeof val === 'string') {
            this._initNewDevice(val);
            return;
        }

        if (val instanceof Object) {
            Object.assign(this, val);
            return;
        }
    }

    // TODO проверить сопоставимость с платформами
    _initNewDevice(user_id) {
        this.user_id = user_id;
        this.build_id = DeviceAPI.osBuildId;
        this.model_name = DeviceAPI.modelName;
        this.brand_name = DeviceAPI.brand;
        this.year_class = DeviceAPI.deviceYearClass;
        this.os_name = DeviceAPI.osName;
        this.photos = [];
    }
    /**
     * Патчит значения свойств переданного объекта и возвращает инстанс.
     * @returns {Advert}
     */
    patch(val) {
        return Object.assign(this, val);
    }

    addPhoto(photo = null) {
        this.photos.push({ photo });
    }

    changeLastPhoto(photo = null) {
        if (!this.photos.length) { return; }
        const lalstIdx = this.photos.length - 1;
        this.photos[lalstIdx] = { photo };
    }

    deleteLastPhoto() {
        if (!this.photos.length) { return; }
        const lalstIdx = this.photos.length - 1;
        this.photos = this.photos.filter((p, i) => lalstIdx !== i);
    }

    belongsTo(userId) {
        return this.user_id === userId;
    }

    /**
     * Проверяет валидность информации о устройстве
     * 
     * @returns {String|boolean}
     */
    validate() {
        const emptyField = Object
            .entries(this)
            .filter(([k, v]) => !['_id', 'publication_date', 'photos'].includes(k))
            .find(([k, v]) => v === null);
        if (emptyField) { return 'Необходимо заполнить все поля'; }

        const invalidPhotos = !this.photos.length || this.photos.find(p => !p)
        if (invalidPhotos) { return 'Необходимо выбрать фото'; }

        return '';
    }

    getInfoForQR() {
        return '';
    }
}