import { Advert } from '../models/Advert';
import { Conversation } from '../models/Conversation';

jest.mock('expo-device', () => ({
  osBuildId: '321',
  modelName: '321',
  brand: '321',
  deviceYearClass: '321',
  osName: '321',
}));
const init = {
  seller: '1',
  advert: '123',
  last_message: 'hi',
  updated_at: 1591276261705,
  unread_count: 10,
};
describe('Conversation', () => {
  it('Корректно инициализирует объект объявления на основе входных данных', () => {
    const c = new Conversation(init);
    expect(c.seller).toMatch(init.seller);
    expect(c.advert).toBeInstanceOf(Advert);
    expect(c.updated_at).toMatch('4 июня 2020 г., 16:11');
  });
});
