import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';

export const fetchData = (
  url: string,
  options?: AxiosRequestConfig,
): Promise<AxiosResponse> => {
  // @ts-ignore
  url = url.startsWith('/') ? `${strapi.backendURL}${url}` : url;
  return axios.get(url, options);
};

export const updateData = (
  url: string,
  data: any,
  options: AxiosRequestConfig,
): Promise<AxiosResponse> => {
  // @ts-ignore
  url = url.startsWith('/') ? `${strapi.backendURL}${url}` : url;
  return axios.put(url, data, options);
};
