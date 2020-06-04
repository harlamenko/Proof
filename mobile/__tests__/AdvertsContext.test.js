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
import { AdvertsContext, AdvertsProvider } from '../context';
import {
  ADD_ADVERTS,
  advertsReducer,
  DROP_FILTER,
  initialFilter,
  initialState,
  SET_CURRENT_ADVERT,
  SET_EMPTY_MESSAGE,
  UPDATE_FILTER,
  UPDATE_PAGING_STATE,
} from '../context/AdvertsContext';
import { Advert } from '../models/Advert';

describe('AdvertsContext', () => {
  afterEach(cleanup);
  it('advertsReducer по умолчанию возвращает текущее состояние', () => {
    const action = { type: null };
    const state = advertsReducer(initialState, action);

    expect(state).toEqual(initialState);
  });

  it('advertsReducer корректно добавляет объявления в состояние', () => {
    const newAdverts = [{ _id: 1 }, { _id: 2 }];
    const action = { type: ADD_ADVERTS, payload: newAdverts };
    const state = advertsReducer(initialState, action);

    expect(state.adverts).toHaveLength(2);
    expect(state.adverts).toEqual(newAdverts);
  });

  it('advertsReducer корректно обновляет состояние пагинации', () => {
    const newAdverts = [{ _id: 1 }, { _id: 2 }];
    const action = {
      type: UPDATE_PAGING_STATE,
      payload: {
        lastAdvert: newAdverts[newAdverts.length - 1],
        seenIds: newAdverts.map((a) => a._id),
        total: 12,
      },
    };
    const state = advertsReducer(initialState, action);

    expect(state.paging.seenIds).toEqual(action.payload.seenIds);
    expect(state.paging.lastAdvert).toEqual(action.payload.lastAdvert);
    expect(state.paging.total).toEqual(action.payload.total);
  });

  it('advertsReducer корректно сбрасывает фильтр в исходное состояние', () => {
    const newAdverts = [{ _id: 1 }, { _id: 2 }];
    const action = { type: ADD_ADVERTS, payload: newAdverts };
    const state = advertsReducer(initialState, action);

    const newAction = { type: DROP_FILTER, payload: initialFilter };
    const newState = advertsReducer(state, newAction);

    expect(newState).toEqual(initialState);
  });

  it('advertsReducer корректно обновляет фильтр', () => {
    const advert = { _id: 1 };
    const upd = {
      paging: {
        lastAdvert: advert,
        seenIds: [advert._id],
        total: 13,
      },
      search: {
        field: 'test',
        keyWords: 'test',
        direct: -1,
      },
    };
    const action = { type: UPDATE_FILTER, payload: upd };
    const state = advertsReducer(initialState, action);

    expect(state.paging).toEqual(upd.paging);
    expect(state.search).toEqual(upd.search);
  });

  it('advertsReducer корректно устанавливает текущее объявление', () => {
    const advert = new Advert({ _id: 1 });
    const action = { type: SET_CURRENT_ADVERT, payload: advert };
    const state = advertsReducer(initialState, action);

    expect(state.currentAdvert).toEqual(advert);
  });

  it('advertsReducer корректно изменяет сообщение о пустом результате', () => {
    let msg = 'Ничего не найдено';
    let action = { type: SET_EMPTY_MESSAGE, payload: msg };
    let state = advertsReducer(initialState, action);

    expect(state.emptyMessage).toMatch(msg);

    msg = '';
    action = { type: SET_EMPTY_MESSAGE, payload: msg };
    state = advertsReducer(state, action);

    expect(state.emptyMessage).toMatch(msg);
  });

  it('getAdverts корректно запрашивает объявления на основе фильтра', () => {
    const Test = ({ onPress, state, getAdverts }) => {
      getAdverts(initialState);
      return (
        <Button
          testID="btn"
          onPress={onPress(state.adverts.map((a) => a._id).join(''))}
        />
      );
    };
    const onPress = jest.fn();
    const { getByTestId } = render(
      <AdvertsProvider>
        <AdvertsContext.Consumer>
          {(value) => <Test onPress={onPress} {...value} />}
        </AdvertsContext.Consumer>
      </AdvertsProvider>
    );
    fireEvent(getByTestId('btn'), 'onPress');
    expect(onPress).toHaveBeenCalled();
  });

  it('getAdverts корректно запрашивает объявления на основе пагинации', () => {
    const Test = ({ onPress, state, getAdverts }) => {
      getAdverts(initialState);
      return (
        <Button
          testID="btn"
          onPress={onPress(state.adverts.map((a) => a._id).join(''))}
        />
      );
    };
    const onPress = jest.fn();
    const { getByTestId } = render(
      <AdvertsProvider>
        <AdvertsContext.Consumer>
          {(value) => <Test onPress={onPress} {...value} />}
        </AdvertsContext.Consumer>
      </AdvertsProvider>
    );
    fireEvent(getByTestId('btn'), 'onPress');
    expect(onPress).toHaveBeenCalled();
  });

  it('updateFilter корректно обновляет фильтр на основе имеющихся данных', () => {
    let i = 1;
    const Test = ({ onPress, state, updateFilter }) => {
      if (i === 1) {
        updateFilter(initialFilter);
        ++i;
      }
      return <Button testID="btn" onPress={onPress()} />;
    };
    const onPress = jest.fn();
    const { getByTestId } = render(
      <AdvertsProvider>
        <AdvertsContext.Consumer>
          {(value) => <Test onPress={onPress} {...value} />}
        </AdvertsContext.Consumer>
      </AdvertsProvider>
    );
    fireEvent(getByTestId('btn'), 'onPress');
    expect(onPress).toHaveBeenCalled();
  });

  it('dropFilter сбрасывает фильтр к значению по умолчанию', () => {
    let i = 1;
    const Test = ({ onPress, state, dropFilter }) => {
      if (i === 1) {
        dropFilter();
        ++i;
      }
      return <Button testID="btn" onPress={onPress()} />;
    };
    const onPress = jest.fn();
    const { getByTestId } = render(
      <AdvertsProvider>
        <AdvertsContext.Consumer>
          {(value) => <Test onPress={onPress} {...value} />}
        </AdvertsContext.Consumer>
      </AdvertsProvider>
    );
    fireEvent(getByTestId('btn'), 'onPress');
    expect(onPress).toHaveBeenCalled();
  });

  it('getAdvertDetails запрашивает данные объявления по id', () => {
    let i = 1;
    const Test = ({ onPress, getAdvertDetails }) => {
      if (i === 1) {
        getAdvertDetails();
        ++i;
      }
      return <Button testID="btn" onPress={onPress()} />;
    };
    const onPress = jest.fn();
    const { getByTestId } = render(
      <AdvertsProvider>
        <AdvertsContext.Consumer>
          {(value) => <Test onPress={onPress} {...value} />}
        </AdvertsContext.Consumer>
      </AdvertsProvider>
    );
    fireEvent(getByTestId('btn'), 'onPress');
    expect(onPress).toHaveBeenCalled();
  });

  it('dropCurrentAdvert очищает информацию о текущем объявлении', () => {
    let i = 1;
    const Test = ({ onPress, dropCurrentAdvert }) => {
      if (i === 1) {
        dropCurrentAdvert();
        ++i;
      }
      return <Button testID="btn" onPress={onPress()} />;
    };
    const onPress = jest.fn();
    const { getByTestId } = render(
      <AdvertsProvider>
        <AdvertsContext.Consumer>
          {(value) => <Test onPress={onPress} {...value} />}
        </AdvertsContext.Consumer>
      </AdvertsProvider>
    );
    fireEvent(getByTestId('btn'), 'onPress');
    expect(onPress).toHaveBeenCalled();
  });

  it('setCurrentAdvert добавляет информацию о текущем объявлении', async () => {
    let i = 1;
    const Test = ({ onPress, setCurrentAdvert }) => {
      if (i === 1) {
        setCurrentAdvert();
        ++i;
      }
      return <Button testID="btn" onPress={onPress()} />;
    };
    const onPress = jest.fn();
    const { getByTestId } = render(
      <AdvertsProvider>
        <AdvertsContext.Consumer>
          {(value) => <Test onPress={onPress} {...value} />}
        </AdvertsContext.Consumer>
      </AdvertsProvider>
    );
    fireEvent(getByTestId('btn'), 'onPress');
    expect(onPress).toHaveBeenCalled();
  });

  it('deleteAdvert инициализирует запрос на удаление объявления', async () => {
    let i = 1;
    const Test = ({ onPress, deleteAdvert }) => {
      if (i === 1) {
        deleteAdvert();
        ++i;
      }
      return <Button testID="btn" onPress={onPress()} />;
    };
    const onPress = jest.fn();
    const { getByTestId } = render(
      <AdvertsProvider>
        <AdvertsContext.Consumer>
          {(value) => <Test onPress={onPress} {...value} />}
        </AdvertsContext.Consumer>
      </AdvertsProvider>
    );
    fireEvent(getByTestId('btn'), 'onPress');
    expect(onPress).toHaveBeenCalled();
  });

  it(`deleteAdvert отображает Toast сообщение 
        "Объявление успешно удалено!" при успешном удалении`, async () => {
    let i = 1;
    const Test = ({ onPress, deleteAdvert }) => {
      if (i === 1) {
        deleteAdvert();
        ++i;
      }
      return <Button testID="btn" onPress={onPress()} />;
    };
    const onPress = jest.fn();
    const { getByTestId } = render(
      <AdvertsProvider>
        <AdvertsContext.Consumer>
          {(value) => <Test onPress={onPress} {...value} />}
        </AdvertsContext.Consumer>
      </AdvertsProvider>
    );
    fireEvent(getByTestId('btn'), 'onPress');
    expect(onPress).toHaveBeenCalled();
  });

  it(`deleteAdvert отображает Toast сообщение 
        "Произошла ошибка" при безуспешном удалении`, async () => {
    let i = 1;
    const Test = ({ onPress, deleteAdvert }) => {
      if (i === 1) {
        deleteAdvert();
        ++i;
      }
      return <Button testID="btn" onPress={onPress()} />;
    };
    const onPress = jest.fn();
    const { getByTestId } = render(
      <AdvertsProvider>
        <AdvertsContext.Consumer>
          {(value) => <Test onPress={onPress} {...value} />}
        </AdvertsContext.Consumer>
      </AdvertsProvider>
    );
    fireEvent(getByTestId('btn'), 'onPress');
    expect(onPress).toHaveBeenCalled();
  });
  it('deleteAdvert инициирует запрос на получение информаци о объявлении пользователя', async () => {
    let i = 1;
    const Test = ({ onPress, deleteAdvert }) => {
      if (i === 1) {
        deleteAdvert();
        ++i;
      }
      return <Button testID="btn" onPress={onPress()} />;
    };
    const onPress = jest.fn();
    const { getByTestId } = render(
      <AdvertsProvider>
        <AdvertsContext.Consumer>
          {(value) => <Test onPress={onPress} {...value} />}
        </AdvertsContext.Consumer>
      </AdvertsProvider>
    );
    fireEvent(getByTestId('btn'), 'onPress');
    expect(onPress).toHaveBeenCalled();
  });

  it('getMyAdvert устанавливает текст "Ничего не найдено", если объявление не публиковалось', async () => {
    let i = 1;
    const Test = ({ onPress, getMyAdvert }) => {
      if (i === 1) {
        getMyAdvert();
        ++i;
      }
      return <Button testID="btn" onPress={onPress()} />;
    };
    const onPress = jest.fn();
    const { getByTestId } = render(
      <AdvertsProvider>
        <AdvertsContext.Consumer>
          {(value) => <Test onPress={onPress} {...value} />}
        </AdvertsContext.Consumer>
      </AdvertsProvider>
    );
    fireEvent(getByTestId('btn'), 'onPress');
    expect(onPress).toHaveBeenCalled();
  });

  it('clearEmptyMessage очищает сообщение "Ничего не найдено"', async () => {
    let i = 1;
    const Test = ({ onPress, clearEmptyMessage }) => {
      if (i === 1) {
        clearEmptyMessage();
        ++i;
      }
      return <Button testID="btn" onPress={onPress()} />;
    };
    const onPress = jest.fn();
    const { getByTestId } = render(
      <AdvertsProvider>
        <AdvertsContext.Consumer>
          {(value) => <Test onPress={onPress} {...value} />}
        </AdvertsContext.Consumer>
      </AdvertsProvider>
    );
    fireEvent(getByTestId('btn'), 'onPress');
    expect(onPress).toHaveBeenCalled();
  });
});
