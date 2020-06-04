import React, { useContext } from 'react';
import { View } from 'react-native';
import { cleanup, render } from 'react-native-testing-library';
import createDataContext from '../context/createDataContext';

const TestStateComponent = (props) => {
  const { state } = useContext(props.Context);
  return <View testID={'testID'} state={state}></View>;
};

const TestActionComponent = (props) => {
  const { action } = useContext(props.Context);
  return <View testID={'testID'} action={action}></View>;
};

describe('DataContext creator', () => {
  afterEach(cleanup);

  it('Должен создавать контекст с значением по умолчанию', () => {
    const init = { p: 1 };
    const { Context, Provider } = createDataContext(
      () => ({}),
      [() => {}],
      init
    );
    const { getByTestId } = render(
      <Provider>
        <TestStateComponent Context={Context} />
      </Provider>
    );

    expect(getByTestId('testID').props.state).toEqual(init);
  });

  it('Должен создавать провайдер контекста с переданными функциями', () => {
    const action = jest.fn();
    const { Context, Provider } = createDataContext(() => ({}), [action], {});
    const { getByTestId } = render(
      <Provider>
        <TestActionComponent Context={Context} action={action} />
      </Provider>
    );

    expect(getByTestId('testID').props.action).not.toBeNull();
  });
});
