/**
 * @desc 网络请求工具
 */
import Axios from 'axios';
import { baseUrl } from 'src/global-var';
import {Notify} from 'vant';
export const errorMes = {
  403: '无权限操作，请联系管理员',
  404: '抱歉，这个页面被大Boss带走了，请先去其他页面看看吧',
  500: '抱歉，我们的页面迷路了，应该很快就会找到它了',
  default: '我们的页面迷路了，应该很快就会找到它了'
};
const config = {
  errorMes,
  baseURL: baseUrl,
  timeout: 1000 * 60,
  interReq: (config) => {
    // const token = getToken();
    // if (token) config.headers.Authorization = `bearer ${token}`;
    return config;
  },
  interRes: res => {
    const data = res.data;
    return Promise.resolve(data);
  },
};

const service = Axios.create(config);
service.interceptors.request.use(config.interReq, error => Promise.reject(error));
service.interceptors.response.use(config.interRes, (error) => {
  const res = error.response;
  const status = (res || {}).data.resp_code;
  const errorMes = config.errorMes[status] || config.errorMes.default;
  if(status===400||status===500){
    if(res.data&&res.data.resp_msg)  Notify({ type: 'warning', message: res.data.resp_msg});
    return ;
  }
  if(errorMes) Notify({ type: 'warning', message: errorMes});
  return Promise.reject(error);
});

export default service;
