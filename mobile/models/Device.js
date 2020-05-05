import * as DeviceAPI from 'expo-device';

export class Device {
    name = null;
    price = null;
    photo = null;
    user_id = null;
    address = null;
    description = null;
    publication_date = null;
    osBuildId = DeviceAPI.osBuildId;
    modelName = DeviceAPI.modelName;
    brand = DeviceAPI.brand;
    deviceYearClass = DeviceAPI.deviceYearClass;
    osName = DeviceAPI.osName;

    constructor(item) {
        if (item instanceof Device) {
            Object.assign(this, item);
        }
    }

    /**
     * Возвращает данные для отображения 
     * @returns {Array<Array<string|number>>}
     */
    getFullInfo() {
        const excludedKeys = ['modelName', 'id', 'photo', 'customCharacteristics'];
        return Object
            .entries(this)
            .filter(([k, _]) => !excludedKeys.includes(k))
            .map(([name, value]) => ({ name, value }));
    }

    setPhoto(uri) {
        this.photo = uri;
    }
    /**
     * Патчит значения свойств переданного объекта  и возвращает инстанс.
     */
    patch(val) {
        return Object.assign(this, val);
    }

    getInfoForQR() {
        const {
            osBuildId,
            modelName,
            brand,
            deviceYearClass,
            osName
        } = this;

        return JSON.stringify({
            osBuildId,
            modelName,
            brand,
            deviceYearClass,
            osName
        });
    }
}