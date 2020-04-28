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
        this.customCharacteristics.push({ name, value });
    }
    /**
     * Возвращает данные для отображения 
     * @returns {Array<Array<string|number>>}
     */
    getVisibleDeviceInfo() {
        const excludedKeys = ['modelName', 'id', 'photo', 'customCharacteristics'];
        return Object
            .entries(this)
            .filter(([k, _]) => !excludedKeys.includes(k))
            .map(([name, value]) => ({ name, value }));
    }

    getCustomCharacteristics() {
        return this.customCharacteristics;
    }

    getFullInfo() {
        return [...this.getVisibleDeviceInfo(), ...this.getCustomCharacteristics()];
    }

    setPhoto(uri) {
        this.photo = uri;
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