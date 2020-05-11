import { AsyncStorage } from 'react-native';
import axios from 'axios';

const httpClient = axios.create({
    baseURL: 'http://9797ca87.ngrok.io'
});

httpClient.interceptors.request.use(async config => {
    const token = await AsyncStorage.getItem('token');

    if (token) {
        config.headers.common['Authorization'] = `Bearer ${token}`;
    }

    return config;
}, function (error) {
    return Promise.reject(error);
});

export default httpClient;