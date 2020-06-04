jest.mock('expo-device', () => ({
  osBuildId: '321',
  modelName: '321',
  brand: '321',
  deviceYearClass: '321',
  osName: '321',
}));
import { Advert } from '../models/Advert';
const init = {
  _id: '123',
  user_id: '123',
  name: '123',
  publication_date: 1591276261705,
  price: '123',
  city: '123',
  model_name: '123',
  build_id: '123',
  brand_name: '123',
  year_class: '123',
  os_name: '123',
  description: '123',
  photos: [{ photo: '123' }],
};
describe('Advert', () => {
  it('Инициализирует объект объявления переданной информацией', () => {
    const advert = new Advert(init);
    expect(advert).toEqual(init);
  });

  it('Создает объект объявления, привязывая id пользователя', () => {
    const user_id = '123';
    const advert = new Advert(user_id);
    expect(advert.user_id).toMatch(user_id);
  });

  it('Изменяет объект объявления на основе переданной информации', () => {
    const user_id = '123';
    const advert = new Advert();
    advert._initNewDevice(user_id);
    expect(advert.user_id).toMatch(user_id);
  });

  it('Частично изменяет объект объявления на основе переданной информации', () => {
    const advert = new Advert();
    advert.patch(init);
    expect(advert).toEqual(init);
  });

  it('Добавляет фото', () => {
    const advert = new Advert();
    advert.addPhoto({ photo: '123' });
    expect(advert.photos).toHaveLength(2);
  });

  it('Изменяет последнее добавленное фото', () => {
    const newPhoto = { photo: '123' };
    const advert = new Advert();
    advert.changeLastPhoto(newPhoto.photo);
    expect(advert.photos[0]).toEqual(newPhoto);
  });

  it('Удаляет фото', () => {
    const advert = new Advert();
    advert.deleteLastPhoto();
    expect(advert.photos).toHaveLength(0);
  });

  it('Корректно проверяет принадлежность пользователю по id', () => {
    const user_id = '123';
    const advert = new Advert(user_id);
    expect(advert.belongsTo(user_id)).toBeTruthy();
    expect(advert.belongsTo('user_id')).toBeFalsy();
  });

  it('Корректно валидирует заполненность информации', () => {
    const user_id = '123';
    const advert = new Advert(user_id);
    expect(advert.validate()).toMatch('Необходимо заполнить все поля');
  });

  it('Корректно генерирует информацию для QR', () => {
    const user_id = '123';
    const advert = new Advert(user_id);
    const { build_id, model_name, brand_name, year_class, os_name } = advert;
    expect(advert.getInfoForQR()).toMatch(
      JSON.stringify({
        build_id,
        model_name,
        brand_name,
        year_class,
        os_name,
      })
    );
  });

  it('Корректно проверяет соответствие информации QR кода и сканируемого устройства', () => {
    const advert = new Advert(init);
    const { build_id, model_name, brand_name, year_class, os_name } = advert;

    expect(
      advert.checkQRInfo(
        JSON.stringify({
          build_id,
          model_name,
          brand_name,
          year_class,
          os_name,
        })
      )
    ).toBeTruthy();
    expect(advert.checkQRInfo(JSON.stringify({}))).toBeFalsy();
  });
});
