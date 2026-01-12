import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.quran.com/api/v4',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // console.log('API Error:', error?.response?.status, error?.message);

    return Promise.reject(error);
  }
);

export default apiClient;
