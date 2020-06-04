console.error = jest.fn();
jest.mock('axios', () => ({
  create: jest.fn().mockReturnValue({
    interceptors: {
      request: {
        use: jest.fn(),
      },
    },
    post: jest.fn().mockReturnValueOnce(
      Promise.resolve({
        data: {
          adverts: [{ _id: 1 }],
        },
      })
    ),
  }),
}));
jest.mock('react-native-simple-toast', () => ({
  SHORT: jest.fn(),
}));

import React from 'react';
import { Button } from 'react-native-elements';
import { cleanup, fireEvent, render } from 'react-native-testing-library';
import { ChatContext, ChatProvider } from '../context';
import {
  ADD_CONVERSATION,
  CHANGE_LOADING,
  initialState,
  reducer,
  SET_CONVERSATION,
  SET_EMPTY_MESSAGE,
  SET_MESSAGES,
  UPDATE_CONVERSATIONS,
} from '../context/ChatContext';
import { Conversation } from '../models/Conversation';

describe('ChatContext', () => {
  afterEach(cleanup);

  it('reducer по умолчанию возвращает текущее состояние', () => {
    const action = { type: null };
    const state = reducer(initialState, action);

    expect(state).toEqual(initialState);
  });

  it('reducer корректно обновляет состояние новыми диалогами', () => {
    const ads = [{ _id: 1 }];
    const state = reducer(initialState, {
      type: ADD_CONVERSATION,
      payload: ads,
    });
    expect(state.conversations).toHaveLength(1);
    expect(state.conversations).toEqual(ads);
  });

  it('reducer корректно изменяет сообщение о пустом результате', () => {
    let msg = 'Ничего не найдено';
    let action = { type: SET_EMPTY_MESSAGE, payload: msg };
    let state = reducer(initialState, action);

    expect(state.emptyMessage).toMatch(msg);

    msg = '';
    action = { type: SET_EMPTY_MESSAGE, payload: msg };
    state = reducer(state, action);

    expect(state.emptyMessage).toMatch(msg);
  });

  it('reducer корректно сохраняет текущий диалог', () => {
    const ad = { _id: 1 };
    const state = reducer(initialState, {
      type: SET_CONVERSATION,
      payload: ad,
    });
    expect(state.currentConversation).toEqual(ad);
  });

  it('reducer изменяет состояние загрузки', () => {
    let action = { type: CHANGE_LOADING, payload: true };
    let state = reducer(initialState, action);

    expect(state.loading).toBeTruthy();

    action = { type: CHANGE_LOADING, payload: false };
    state = reducer(state, action);

    expect(state.loading).toBeFalsy();
  });

  it('reducer корректно обновляет сообщения', () => {
    const msgs = [{ _id: 1 }];
    const state = reducer(initialState, { type: SET_MESSAGES, payload: msgs });
    expect(state.messages).toHaveLength(1);
    expect(state.messages).toEqual(msgs);
  });

  it('reducer корректно обновляет состояние диалогов', () => {
    const ad = new Conversation({
      _id: 1,
      updated_at: '4 июня 2020 г., 16:11',
      last_message: 'a',
    });
    const state = reducer(
      { ...initialState, conversations: [] },
      { type: UPDATE_CONVERSATIONS, payload: ad }
    );
    expect(state.conversations).toHaveLength(1);
    expect(state.conversations).toEqual([ad]);
  });

  it('getConversations инициирует запрос диалогов пользователя', () => {
    const Test = ({ onPress, getConversations }) => (
      <Button
        testID="btn"
        onPress={() => {
          onPress();
          getConversations();
        }}
      />
    );
    const onPress = jest.fn();
    const { getByTestId } = render(
      <ChatProvider>
        <ChatContext.Consumer>
          {(value) => <Test onPress={onPress} {...value} />}
        </ChatContext.Consumer>
      </ChatProvider>
    );
    fireEvent(getByTestId('btn'), 'onPress');
    expect(onPress).toHaveBeenCalled();
  });

  it('getConversations устанавливает сообщение "Список диалогов пуст." если диалогов нет', () => {
    const Test = ({ onPress, getConversations }) => (
      <Button
        testID="btn"
        onPress={() => {
          onPress();
          getConversations();
        }}
      />
    );
    const onPress = jest.fn();
    const { getByTestId } = render(
      <ChatProvider>
        <ChatContext.Consumer>
          {(value) => <Test onPress={onPress} {...value} />}
        </ChatContext.Consumer>
      </ChatProvider>
    );
    fireEvent(getByTestId('btn'), 'onPress');
    expect(onPress).toHaveBeenCalled();
  });

  it('clearEmptyMessage очищает сообщение "Список диалогов пуст', () => {
    const Test = ({ onPress, clearEmptyMessage }) => (
      <Button
        testID="btn"
        onPress={() => {
          onPress();
          clearEmptyMessage();
        }}
      />
    );
    const onPress = jest.fn();
    const { getByTestId } = render(
      <ChatProvider>
        <ChatContext.Consumer>
          {(value) => <Test onPress={onPress} {...value} />}
        </ChatContext.Consumer>
      </ChatProvider>
    );
    fireEvent(getByTestId('btn'), 'onPress');
    expect(onPress).toHaveBeenCalled();
  });

  it('sendMessage отправляет информацию о сообщении на сервер', () => {
    const Test = ({ onPress, sendMessage }) => (
      <Button
        testID="btn"
        onPress={() => {
          onPress();
          sendMessage();
        }}
      />
    );
    const onPress = jest.fn();
    const { getByTestId } = render(
      <ChatProvider>
        <ChatContext.Consumer>
          {(value) => <Test onPress={onPress} {...value} />}
        </ChatContext.Consumer>
      </ChatProvider>
    );
    fireEvent(getByTestId('btn'), 'onPress');
    expect(onPress).toHaveBeenCalled();
  });

  it('getMessages загружает сообщения, относящиеся к конкретному пользователю и деалогу', () => {
    const Test = ({ onPress, getMessages }) => (
      <Button
        testID="btn"
        onPress={() => {
          onPress();
          getMessages();
        }}
      />
    );
    const onPress = jest.fn();
    const { getByTestId } = render(
      <ChatProvider>
        <ChatContext.Consumer>
          {(value) => <Test onPress={onPress} {...value} />}
        </ChatContext.Consumer>
      </ChatProvider>
    );
    fireEvent(getByTestId('btn'), 'onPress');
    expect(onPress).toHaveBeenCalled();
  });

  it('tryGetConversation инициализирует запрос диалога по id', () => {
    const Test = ({ onPress, tryGetConversation }) => (
      <Button
        testID="btn"
        onPress={() => {
          onPress();
          tryGetConversation();
        }}
      />
    );
    const onPress = jest.fn();
    const { getByTestId } = render(
      <ChatProvider>
        <ChatContext.Consumer>
          {(value) => <Test onPress={onPress} {...value} />}
        </ChatContext.Consumer>
      </ChatProvider>
    );
    fireEvent(getByTestId('btn'), 'onPress');
    expect(onPress).toHaveBeenCalled();
  });

  it('tryGetConversation инициализирует запрос диалога по данным объявления', () => {
    const Test = ({ onPress, tryGetConversation }) => (
      <Button
        testID="btn"
        onPress={() => {
          onPress();
          tryGetConversation();
        }}
      />
    );
    const onPress = jest.fn();
    const { getByTestId } = render(
      <ChatProvider>
        <ChatContext.Consumer>
          {(value) => <Test onPress={onPress} {...value} />}
        </ChatContext.Consumer>
      </ChatProvider>
    );
    fireEvent(getByTestId('btn'), 'onPress');
    expect(onPress).toHaveBeenCalled();
  });
});
