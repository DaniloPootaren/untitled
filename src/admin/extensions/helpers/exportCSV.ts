import {ADMIN_API_TOKEN} from '../constants/token';
import {AxiosRequestConfig} from 'axios';

export const apiTokenOptions: AxiosRequestConfig = {
  headers: {
    Authorization: `Bearer ${ADMIN_API_TOKEN}`,
  },
};

export const axiosRequestConfig: AxiosRequestConfig = {
  headers: {
    ...apiTokenOptions.headers,
  },
  responseType: 'arraybuffer',
};
