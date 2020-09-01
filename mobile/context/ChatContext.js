import httpClient from '../api/ProofAPI';
import { Conversation } from '../models/Conversation';
import createDataContext from './createDataContext';
export const initialState = {
  conversations: null,
  emptyMessage: null,
  currentConversation: null,
  messages: null,
  loading: false,
};
export const ADD_CONVERSATION = 'ADD_CONVERSATION';
export const UPDATE_CONVERSATIONS = 'UPDATE_CONVERSATIONS';
export const SET_EMPTY_MESSAGE = 'SET_EMPTY_MESSAGE';
export const SET_CONVERSATION = 'SET_CONVERSATION';
export const CHANGE_LOADING = 'CHANGE_LOADING';
export const SET_MESSAGES = 'SET_MESSAGES';

export const reducer = (prevState, action) => {
  switch (action.type) {
    case ADD_CONVERSATION:
      return {
        ...prevState,
        conversations: action.payload,
      };
    case SET_EMPTY_MESSAGE:
      return {
        ...prevState,
        emptyMessage: action.payload,
      };
    case SET_CONVERSATION:
      const prevConv = prevState.currentConversation || {};
      return {
        ...prevState,
        currentConversation: { ...prevConv, ...action.payload },
      };
    case CHANGE_LOADING:
      return {
        ...prevState,
        loading: action.payload,
      };
    case SET_MESSAGES:
      return {
        ...prevState,
        messages: action.payload,
      };
    case UPDATE_CONVERSATIONS:
      let { conversations } = prevState;
      const { _id, updated_at, last_message } = action.payload;
      if (conversations) {
        const c = conversations.find((c) => c._id === _id);

        if (c) {
          c.updated_at = updated_at;
          c.last_message = last_message;
        } else {
          conversations.push(new Conversation(action.payload));
          conversations.sort((a, b) => b.updated_at - a.updated_at);
        }
      } else {
        conversations = [new Conversation(action.payload)];
      }

      return {
        ...prevState,
        conversations,
      };
    default:
      return prevState;
  }
};

const getConversations = (dispatch) => async () => {
  dispatch({ type: CHANGE_LOADING, payload: true });
  try {
    const { data } = await httpClient.get('/conversations');

    if (data && data.length) {
      dispatch({
        type: ADD_CONVERSATION,
        payload: data.map((el) => new Conversation(el)),
      });
    } else {
      dispatch({ type: SET_EMPTY_MESSAGE, payload: 'Список диалогов пуст.' });
    }
  } catch (err) {
    console.error(err);
  }
  dispatch({ type: CHANGE_LOADING, payload: false });
};

const updateConversations = (dispatch) => (payload) => {
  dispatch({ type: UPDATE_CONVERSATIONS, payload });
};

const clearEmptyMessage = (dispatch) => () => {
  dispatch({ type: SET_EMPTY_MESSAGE, payload: null });
};

const sendMessage = (dispatch) => async (info) => {
  try {
    const { data } = await httpClient.post(
      `/conversation/${info.msg.conversation}`,
      info
    );

    if (!data) {
      return;
    }

    dispatch({ type: SET_CONVERSATION, payload: { _id: data.conversationId } });
  } catch (err) {
    console.error(err);
  }
};

const tryGetConversation = (dispatch) => async (conv) => {
  dispatch({ type: CHANGE_LOADING, payload: true });
  const { seller, advert, buyer, _id: cid = null } = conv;

  if (cid) {
    dispatch({ type: SET_CONVERSATION, payload: new Conversation(conv) });
  } else {
    dispatch({ type: SET_CONVERSATION, payload: conv });
  }

  try {
    if (cid) {
      const {
        data: { messages, conversation },
      } = await httpClient.get(`/conversation/${cid}`);

      dispatch({
        type: SET_CONVERSATION,
        payload: new Conversation(conversation),
      });
      dispatch({ type: SET_MESSAGES, payload: messages });
      dispatch({ type: CHANGE_LOADING, payload: false });
      return;
    }

    const { data } = await httpClient.get(
      `/conversation/${seller}/${advert}/${buyer}`
    );

    if (!data || !data._id) {
      dispatch({ type: CHANGE_LOADING, payload: false });
      return;
    }

    dispatch({ type: SET_CONVERSATION, payload: new Conversation(data) });
    const {
      data: { messages },
    } = await httpClient.get(`/conversation/${data._id}`);

    dispatch({ type: SET_MESSAGES, payload: messages });
  } catch (err) {
    console.error(err);
  }

  dispatch({ type: CHANGE_LOADING, payload: false });
};

const getMessages = (dispatch) => async (cid) => {
  dispatch({ type: CHANGE_LOADING, payload: true });
  try {
    dispatch({ type: SET_MESSAGES, payload: [] });

    const {
      data: { messages },
    } = await httpClient.get(`/conversation/${cid}`);

    dispatch({ type: SET_MESSAGES, payload: messages });
  } catch (err) {
    console.error(err);
  }
  dispatch({ type: CHANGE_LOADING, payload: false });
};

export const { Provider, Context } = createDataContext(
  reducer,
  {
    getConversations,
    clearEmptyMessage,
    sendMessage,
    getMessages,
    tryGetConversation,
    updateConversations,
  },
  initialState
);
