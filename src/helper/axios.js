import axios from 'axios';
import { LocalStorageService } from './utils';

const baseUrl = process.env.REACT_APP_API_URL;
const client = axios.create({
  baseURL: baseUrl,
  headers: {
    'api-key': process.env.REACT_APP_API_KEY,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

const callList = [];
const toggleIndicator = (url, type) => {
  if (type) {
    callList.push(`${baseUrl}/${url}`);
    document.querySelector('.showLoader').style.display = 'flex';
  }

  if (!type) {
    const index = callList.indexOf(`${baseUrl}/${url}`);
    if (index !== -1) {
      callList.splice(index, 1); /* eslint-disable */
    }
    if (callList.length === 0) {
      document.querySelector('.showLoader').style.display = 'none';
    }
  }
};

client.interceptors.request.use(
  (config) => {
    toggleIndicator(config.url, true);
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

client.interceptors.response.use(
  (response) => {
    toggleIndicator(response.config.url, false);
    return response;
  },
  async function (error) {
    //console.log("Error", error);
    const originalRequest = error.config;
    toggleIndicator(arguments[0].config.url, false);

    if (
      error.response.status === 422 &&
      ((error.response.data &&
        error.response.data.errors &&
        error.response.data.errors.error &&
        error.response.data.errors.error.name === 'JsonWebTokenError') ||
        (error.response.data &&
          error.response.data.errors &&
          error.response.data.errors.error &&
          error.response.data.errors.error.name === 'TokenExpiredError'))
    ) {
      await axios
        .get(`${baseUrl}/auth/refresh-token`, {
          headers: {
            'api-key': process.env.REACT_APP_API_KEY,
            authorization: `${localStorage.getItem('refreshToken')}`,
          },
        })
        .then((res) => {
          localStorage.setItem('accessToken', res.data.data.token);
          localStorage.setItem('refreshToken', res.data.data.refresh_token);
        })
        .catch((err) => {
          LocalStorageService.clearToken();
          window.location = '/login';
          return false;
        });
      originalRequest._retry = true;
      originalRequest.headers.authorization = `${localStorage.getItem(
        'accessToken'
      )}`;

      return axios(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default client;
