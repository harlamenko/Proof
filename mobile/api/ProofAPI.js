import axios from 'axios';
import { AsyncStorage } from 'react-native';

const httpClient = axios.create({
  baseURL: 'https://d43026d948e6.ngrok.io', // 'https://polar-tor-80847.herokuapp.com',
});

httpClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');

    if (token) {
      config.headers.common['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default httpClient;
