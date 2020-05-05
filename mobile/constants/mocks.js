import { Device } from '../models/Device';

let counter = 0;

class MockDevice extends Device {
    id = ++counter;
    osBuildId = Math.floor(Math.random() * 9999999999);
    modelName = 'Vertu 123';
    brand = 'Vertu';
    deviceYearClass = 2010;
    osName = 'bluberry';
    photo = 'https://c.dns-shop.ru/thumb/st1/fit/320/250/71bb228d80898db5123334cb4b2e6a46/dec714edb54cfa63238a3e4edd9adca0764c4aec9a15c85a54505e164a1a6391.jpg';

    constructor() {
        super();
    }
}

export const adverts = [
    new MockDevice(),
    new MockDevice(),
    new MockDevice(),
    new MockDevice(),
]