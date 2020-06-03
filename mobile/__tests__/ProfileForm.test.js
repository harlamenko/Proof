jest.mock('react-native-simple-toast', () => ({
  SHORT: jest.fn(),
}));
jest.mock('expo-image-picker', () => ({
  MediaTypeOptions: { Images: '' },
  requestCameraRollPermissionsAsync: jest
    .fn()
    .mockReturnValue(Promise.resolve({ granted: true })),
  launchImageLibraryAsync: jest
    .fn()
    .mockReturnValue(Promise.resolve({ cancelled: false })),
}));
jest.mock('expo-image-manipulator', () => ({
  manipulateAsync: jest.fn().mockReturnValue(Promise.resolve({ base64: '' })),
}));
jest.mock('expo-permissions', () => ({
  askAsync: jest.fn().mockReturnValue(Promise.resolve({ status: 'granted' })),
}));

import React from 'react';
import { cleanup, fireEvent, render } from 'react-native-testing-library';
import { ProfileForm } from '../components';

describe('ProfileForm', () => {
  afterEach(cleanup);

  it('Должен рендерится', () => {
    expect(
      render(<ProfileForm image={''} name={''} onNameChanged={() => {}} />)
    ).not.toBeNull();
  });

  it('Должен вызывать onNameChanged при изменении имени', () => {
    const onEventMock = jest.fn();
    const { getByTestId } = render(
      <ProfileForm image={''} name={''} onNameChanged={onEventMock} />
    );
    fireEvent(getByTestId('Name'), 'onChangeText');
    expect(onEventMock).toHaveBeenCalled();
  });

  it('Должен вызывать onPickImage при выборе фото', async () => {
    const onEventMock = jest.fn();
    const { getByTestId } = render(
      <ProfileForm
        image={''}
        name={''}
        onNameChanged={() => {}}
        onPickImage={onEventMock}
      />
    );
    await fireEvent(getByTestId('Avatar'), 'onPress');
    expect(onEventMock).toHaveBeenCalled();
  });

  it('Должен вызывать onPickImage при изменении фото', async () => {
    const onEventMock = jest.fn();
    const { getByTestId } = render(
      <ProfileForm
        image={'123'}
        name={''}
        onNameChanged={() => {}}
        onPickImage={onEventMock}
      />
    );
    await fireEvent(getByTestId('Avatar'), 'onAccessoryPress');
    expect(onEventMock).toHaveBeenCalled();
  });
});
