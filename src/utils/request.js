import axios from "axios";
import qs from "qs";
import { Message } from "element-ui";
// 使用location对象动态拼接url
const tempName = window.location.pathname.split("/")[1];
const _url =
  window.location.protocol + "//" + window.location.host + "/" + tempName;

// 利用axios对象的方法create，去创建一个axios实例
const request = axios.create({
  // 默认请求路径
  baseURL: "/api/", // vip联调
  // baseURL: _url, // 打包更换
  // 请求超时时间（30s内没响应就失败了）
  timeout: 30000,
});

// 请求拦截器
// axios实例的拦截器的request请求使用配置对象，返回配置对象
request.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    // 请求失败的返回，后面的then或者catch回调随便写不写
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 响应成功的返回
    return response.data;
  },
  (error) => {
    const { response } = error;
    if (response) {
      // 服务器响应码处理
      switch (response.status) {
        case 500:
          console.log("500错误");
          // todo..
          break;
      }
    }
    // 响应失败的返回
    return Promise.reject(error);
  }
);

// 导出axios实例
export default request;
