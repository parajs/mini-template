import { REQUEST } from 'miniprogram-request';
import { baseURL } from './config';

REQUEST.Defaults.baseURL = baseURL;
REQUEST.Listeners.onResponse.push(console.log);
REQUEST.Defaults.responseType = 'json';
REQUEST.Defaults.headers = {};
export default REQUEST;

