import { AsyncStorage } from 'react-native';
import axios from 'axios';

const httpClient = axios.create({
    baseURL: 'https://be3d90e5.ngrok.io'
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