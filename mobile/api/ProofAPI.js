import axios from 'axios';
import { AsyncStorage } from 'react-native';

const httpClient = axios.create({
  baseURL: 'https://45ad8cf2a1fc.ngrok.io',
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
