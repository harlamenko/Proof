import createDataContext from "./createDataContext";
import ProofAPI from '../api/ProofAPI';
import { Advert } from "../models/Advert";

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
        adverts: []
      };
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

export const { Provider, Context } = createDataContext(
  advertsReducer,
  { getAdverts, updateFilter, dropFilter },
  { ...initialFilter, adverts: [] }
);