import { Message } from '../models/Message';

const init = {
  user: { _id: '1' },
  text: 'hi',
  createdAt: 1591276261705,
};
describe('Message', () => {
  it('Корректно инициализирует объект сообщения на основе входных данных', () => {
    const m = new Message(init);
    expect(m.user).toMatch(init.user._id);
    expect(m.text).toMatch(init.text);
    expect(m.createdAt).toBeGreaterThanOrEqual(init.createdAt);
  });
});
