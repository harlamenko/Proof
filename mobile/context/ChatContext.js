import httpClient from "../api/ProofAPI";
import createDataContext from "./createDataContext";
import io from 'socket.io-client';
import { Conversation } from "../models/Conversation";

const ADD_CONVERSATION = 'ADD_CONVERSATION';
const UPDATE_CONVERSATIONS = 'UPDATE_CONVERSATIONS';
const SET_EMPTY_MESSAGE = 'SET_EMPTY_MESSAGE';
const SET_CONVERSATION = 'SET_CONVERSATION';
const CHANGE_LOADING = 'CHANGE_LOADING';
const SET_MESSAGES = 'SET_MESSAGES';

const reducer = (prevState, action) => {
    switch (action.type) {
        case ADD_CONVERSATION:
            return {
                ...prevState,
                conversations: action.payload
            }
        case SET_EMPTY_MESSAGE:
            return {
                ...prevState,
                emptyMessage: action.payload
            }
        case SET_CONVERSATION:
            const prevConv = prevState.currentConversation || {};
            return {
                ...prevState,
                currentConversation: { ...prevConv, ...action.payload }
            }
        case CHANGE_LOADING:
            return {
                ...prevState,
                loading: action.payload
            }
        case SET_MESSAGES:
            return {
                ...prevState,
                messages: action.payload
            }
        case UPDATE_CONVERSATIONS:
            const { conversations } = prevState;
            const { _id, updated_at, last_message } = action.payload
            const c = conversations.find(c => c._id === _id);

            if (c) {
                c.updated_at = updated_at;
                c.last_message = last_message
            } else {
                conversations.push(new Conversation(action.payload));
            }

            conversations.sort((a, b) => b.updated_at - a.updated_at);

            return {
                ...prevState,
                conversations
            }
        default:
            return prevState;
    }
}

const getConversations = dispatch => async () => {
    dispatch({ type: CHANGE_LOADING, payload: true });
    try {
        // TODO добавить кэширование
        // const data = JSON.parse('[{"_id":"5ec453fa7198462087a459d9","advert":{"_id":"5ebfb6df44b6ec09200bd04e","user_id":"5ead94a6ef25f930080cb561","name":"qwer","publication_date":"2020-05-16T09:48:15.093Z","price":1234,"city":"qwert","model_name":"Android SDK built for x86","build_id":"QSR1.190920.001","brand_name":"google","year_class":2013,"os_name":"Android","description":"qwert fghj","photos":[{"_id":"5ebfb6df44b6ec09200bd04d","photo":"blya"}]},"buyer":{"_id":"5eab0126b8121445a47ba7c5","email":"mail1@mail.com"},"seller":{"_id":"5ead94a6ef25f930080cb561","email":"admin"},"last_message":"testing for my momtesting for my momtesting for my momtesting for my momtesting for my momtesting for my momtesting for my momtesting for my momtesting for my momtesting for my momtesting for my momtesting for my momtesting for my momtesting for my momtesting for my momtesting for my momtesting for my momtesting for my mom","updated_at":"2020-05-21T15:46:07.838Z"}]');
        const { data } = await httpClient.get('/conversations');

        if (data && data.length) {
            dispatch({ type: ADD_CONVERSATION, payload: data.map(el => new Conversation(el)) });
        } else {
            dispatch({ type: SET_EMPTY_MESSAGE, payload: 'Список диалогов пуст.' });
        }
    } catch (err) {
        console.error(err);
    }
    dispatch({ type: CHANGE_LOADING, payload: false });
}

const updateConversations = dispatch => payload => {
    dispatch({ type: UPDATE_CONVERSATIONS, payload });
}

const clearEmptyMessage = dispatch => () => {
    dispatch({ type: SET_EMPTY_MESSAGE, payload: null })
}

const sendMessage = dispatch => async info => {
    try {
        const { data } = await httpClient.post(`/conversation/${info.msg.conversation}`, info);

        if (!data) { return; }

        dispatch({ type: SET_CONVERSATION, payload: { _id: data.conversationId } });
    } catch (err) {
        console.error(err);
    }
}

const tryGetConversation = dispatch => async conv => {
    const { seller, advert, buyer, _id: cid = null } = conv;

    dispatch({ type: CHANGE_LOADING, payload: true });
    dispatch({ type: SET_CONVERSATION, payload: new Conversation(conv) })

    try {
        if (cid) {
            const { data: { messages } } = await httpClient.get(`/conversation/${cid}`);

            dispatch({ type: SET_MESSAGES, payload: messages });
            dispatch({ type: CHANGE_LOADING, payload: false });
            return;
        }

        const { data } = await httpClient.get(`/conversation/${seller}/${advert}/${buyer}`);
        dispatch({ type: SET_CONVERSATION, payload: new Conversation(data) });

        if (!data || !data._id) { return; }

        // TODO добавить кэширование
        const { data: { messages } } = await httpClient.get(`/conversation/${data._id}`);

        dispatch({ type: SET_MESSAGES, payload: messages });
        dispatch({ type: CHANGE_LOADING, payload: false });
    } catch (err) {
        console.error(err);
    }

    dispatch({ type: CHANGE_LOADING, payload: false });
};

const getMessages = dispatch => async cid => {
    // TODO добавить кэширование
    dispatch({ type: CHANGE_LOADING, payload: true });
    try {
        dispatch({ type: SET_MESSAGES, payload: [] });

        const { data: { messages } } = await httpClient.get(`/conversation/${cid}`);

        dispatch({ type: SET_MESSAGES, payload: messages });
    } catch (err) {
        console.error(err);
    }
    dispatch({ type: CHANGE_LOADING, payload: false });
}

export const { Provider, Context } = createDataContext(
    reducer,
    {
        getConversations,
        clearEmptyMessage,
        sendMessage,
        getMessages,
        tryGetConversation,
        updateConversations
    },
    {
        conversations: null,
        emptyMessage: null,
        currentConversation: null,
        messages: null,
        loading: false
    }
);