import dayjs, { format } from '../shared/day';

describe('day', () => {
  it('Предустрановлена российская локаль', () => {
    expect(dayjs).toHaveProperty('Ls.ru');
  });

  it('Корректно приводит дату к российскому формату', () => {
    const date = format(1591276261705);
    expect(date).toEqual('4 июня 2020 г., 16:11');
  });
});
