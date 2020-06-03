jest.mock('react-native-simple-toast', () => ({
  SHORT: jest.fn(),
}));
jest.mock('expo-image-picker', () => ({
  requestCameraRollPermissionsAsync: jest
    .fn()
    .mockReturnValue(Promise.resolve({ granted: true })),
  launchImageLibraryAsync: jest
    .fn()
    .mockReturnValueOnce(Promise.resolve({ cancelled: true }))
    .mockReturnValueOnce(Promise.resolve({ cancelled: true }))
    .mockReturnValue(Promise.resolve({ cancelled: false })),
}));
jest.mock('expo-image-manipulator', () => ({
  manipulateAsync: jest.fn().mockReturnValue(Promise.resolve({ base64: '' })),
}));
import React from 'react';
import { cleanup, fireEvent, render } from 'react-native-testing-library';
import { AdvertForm } from '../components';
import { Advert } from '../models/Advert';

describe('AdvertForm', () => {
  afterEach(cleanup);

  it('Должен рендерится', () => {
    expect(render(<AdvertForm advert={new Advert()} />)).not.toBeNull();
  });

  it('Должен отображать фото объявления, если оно есть', () => {
    const { getByTestId } = render(<AdvertForm advert={new Advert()} />);
    expect(() => getByTestId('AdvertImage')).not.toBeNull();
  });

  it('Должен отображать фото-пикер, если у объявления нет фото', () => {
    const { getByTestId } = render(
      <AdvertForm advert={new Advert({ photos: [] })} />
    );
    expect(() => getByTestId('ImagePicker')).not.toBeNull();
  });

  it('Вызывается проп-функция onNameChange при изменении названия', () => {
    const onEventMock = jest.fn();
    const { getByTestId } = render(
      <AdvertForm advert={new Advert()} onNameChange={onEventMock} />
    );
    fireEvent(getByTestId('AdvertName'), 'onChangeText', 'a');
    expect(onEventMock).toHaveBeenCalledWith('a');
  });

  it('Вызывается проп-функция onPriceChange при изменении цены', () => {
    const onEventMock = jest.fn();
    const { getByTestId } = render(
      <AdvertForm advert={new Advert()} onPriceChange={onEventMock} />
    );
    fireEvent(getByTestId('AdvertPrice'), 'onChangeText', 'a');
    expect(onEventMock).toHaveBeenCalledWith('a');
  });

  it('Вызывается проп-функция onCityChange при изменении города', () => {
    const onEventMock = jest.fn();
    const { getByTestId } = render(
      <AdvertForm advert={new Advert()} onCityChange={onEventMock} />
    );
    fireEvent(getByTestId('AdvertCity'), 'onChangeText', 'a');
    expect(onEventMock).toHaveBeenCalledWith('a');
  });

  it('Вызывается проп-функция onDescriptionChange при изменении описания', () => {
    const onEventMock = jest.fn();
    const { getByTestId } = render(
      <AdvertForm advert={new Advert()} onDescriptionChange={onEventMock} />
    );
    fireEvent(getByTestId('AdvertDescription'), 'onChangeText', 'a');
    expect(onEventMock).toHaveBeenCalledWith('a');
  });

  it('Вызывается проп-функция onPhotoAdding при начале выбора фото', async () => {
    const onEventMock = jest.fn();
    const { getByTestId } = render(
      <AdvertForm
        advert={new Advert({ photos: [] })}
        onPickingCanceled={() => {}}
        onPhotoAdding={onEventMock}
      />
    );

    await fireEvent(getByTestId('ImagePicker'), 'onPress');
    expect(onEventMock).toHaveBeenCalled();
  });

  it('Вызывается проп-функция onPickingCanceled при отмене выбора фото', async () => {
    const onEventMock = jest.fn();
    const { getByTestId } = render(
      <AdvertForm
        advert={new Advert({ photos: [] })}
        onPickingCanceled={onEventMock}
        onPhotoAdding={() => {}}
      />
    );

    await fireEvent(getByTestId('ImagePicker'), 'onPress');
    expect(onEventMock).toHaveBeenCalled();
  });

  it('Вызывается проп-функция onPhotoAdded при окончании выбора фото', async () => {
    const onEventMock = jest.fn();
    const { getByTestId } = render(
      <AdvertForm
        advert={new Advert({ photos: [] })}
        onPhotoAdded={onEventMock}
        onPhotoAdding={() => {}}
      />
    );

    await fireEvent(getByTestId('ImagePicker'), 'onPress');
    expect(onEventMock).toHaveBeenCalled();
  });
});
