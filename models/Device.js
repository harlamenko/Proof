import * as DeviceAPI from 'expo-device';

export class Device {
    osBuildId = DeviceAPI.osBuildId;
    modelName = DeviceAPI.modelName;
    brand = DeviceAPI.brand;
    deviceYearClass = DeviceAPI.deviceYearClass;
    osName = DeviceAPI.osName;
    photo = null;
    customCharacteristics = [];

    constructor(item) {
        if (item instanceof Device) {
            Object.assign(this, item);
        }
    }

    addCustomCharacteristics(name, value) {
        this.customCharacteristics.push({name, value});
    }
    /**
     * Возвращает данные для отображения 
     * @returns {Array<Array<string|number>>}
     */
    getVisibleInfo() {
        return Object.entries(this).filter(([k, _]) => {
            return !['photo', 'customCharacteristics'].includes(k);
        });
    }

    setPhoto(uri) {
        this.photo = uri;
    }
}