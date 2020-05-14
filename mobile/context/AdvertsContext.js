import createDataContext from "./createDataContext";
import ProofAPI from '../api/ProofAPI';
import { Advert } from "../models/Advert";
import Toast from 'react-native-simple-toast';

const initialFilter = {
  paging: {
    lastAdvert: null,
    seenIds: [],
    total: 0
  },
  search: {
    field: "publication_date",
    keyWords: null,
    direct: -1
  }
}

const advertsReducer = (prevState, action) => {
  switch (action.type) {
    case 'ADD_ADVERTS':
      return {
        ...prevState,
        adverts: [...prevState.adverts, ...action.payload]
      };
    case 'UPDATE_PAGING_STATE':
      const { lastAdvert, seenIds, total } = action.payload;

      return {
        ...prevState,
        paging: {
          seenIds: [...prevState.paging.seenIds, ...seenIds],
          lastAdvert,
          total
        }
      };
    case 'DROP_FILTER':
    case 'UPDATE_FILTER':
      return {
        ...action.payload,
        adverts: [],
        currentAdvert: null
      };
    case 'SET_CURRENT_ADVERT':
      return {
        ...prevState,
        currentAdvert: action.payload
      }
    default:
      return prevState;
  }
};

const getAdverts = dispatch => async ({ paging, search }) => {
  try {
    const res = await ProofAPI.post('/adverts', { paging, search })
    const adverts = res.data.adverts.map(obj => new Advert(obj));

    if (!adverts.length) { return; }

    const { total } = res.data;
    const { publication_date, price } = adverts[adverts.length - 1];

    dispatch({ type: 'ADD_ADVERTS', payload: adverts });
    dispatch({
      type: 'UPDATE_PAGING_STATE',
      payload: {
        lastAdvert: { publication_date, price },
        seenIds: adverts.map(ad => ad.id),
        total
      }
    });
  } catch (err) {
    console.error(err);
  }
}

const updateFilter = dispatch => ({ search }) => {
  const { paging } = initialFilter;
  dispatch({ type: 'UPDATE_FILTER', payload: { search, paging } });
}

const dropFilter = dispatch => () => {
  dispatch({ type: 'DROP_FILTER', payload: initialFilter });
}

const getAdvertDetails = dispatch => async (id) => {
  try {
    const { data: advert } = await ProofAPI.get(`/adverts/${id}`);

    dispatch({ type: 'SET_CURRENT_ADVERT', payload: new Advert(advert) })
  } catch (err) {
    console.error(err);
  }
}

const dropCurrentAdvert = dispatch => () => {
  dispatch({ type: 'SET_CURRENT_ADVERT', payload: null });
}

const setCurrentAdvert = dispatch => advert => {
  dispatch({ type: 'SET_CURRENT_ADVERT', payload: new Advert(advert) })
}

const deleteAdvert = dispatch => async id => {
  try {
    await ProofAPI.delete(`/adverts/${id}`);
    Toast.showWithGravity('Объявление успешно удалено!', Toast.SHORT, Toast.CENTER);

  } catch (err) {
    console.error(err);
    Toast.showWithGravity('Произошла ошибка', Toast.SHORT, Toast.CENTER);
  }

}

export const { Provider, Context } = createDataContext(
  advertsReducer,
  { getAdverts, updateFilter, dropFilter, getAdvertDetails, dropCurrentAdvert, setCurrentAdvert, deleteAdvert },
  { ...initialFilter, adverts: [], currentAdvert: null }
);