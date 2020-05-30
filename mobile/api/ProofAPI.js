import axios from 'axios';
import { AsyncStorage } from 'react-native';

const httpClient = axios.create({
  baseURL: 'https://86ddb859409d.ngrok.io', // 'https://polar-tor-80847.herokuapp.com',
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
