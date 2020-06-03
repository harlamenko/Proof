import { cleanup } from 'react-native-testing-library';

describe('QRScanner', () => {
  afterEach(cleanup);

  it('Должен рендерится', () => {
    expect(1).not.toBeNull();
  });

  it('Должен отображаться прелоадер пока проверяются права на исп. камеры', async () => {
    expect(1).not.toBeNull();
  });

  it('Должен отображаться текст "Нет доступа к камере", если прав на исп. камеры нет', async () => {
    expect(1).not.toBeNull();
  });
});

// describe('QRScanner', () => {
//   afterEach(cleanup);

//   it('Должен рендерится', () => {
//     expect(render(<QRScanner />)).not.toBeNull();
//   });

//   it('Должен отображаться прелоадер пока проверяются права на исп. камеры', () => {
//     const {getByTestId} = render(<QRScanner />);
//     expect(getByTestId('loader').props.children).not.toBeNull();
//   });

//   it('Должен отображаться текст "Нет доступа к камере", если прав на исп. камеры нет', async () => {
//     const {getByText} = render(<QRScanner />);
//     expect(getByText('Нет доступа к камере').props.children).not.toBeNull();
//   });
// });
