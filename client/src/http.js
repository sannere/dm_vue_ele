import axios from 'axios';
import { Message, Loading } from 'element-ui';
import router from './router';

let loading;
function startLoading() {
  loading = Loading.service({
    lock: true,
    text: '拼命加載中...',
    background: 'rgba(0,0,0,0,7)'
  });
}

function endLoading() {
  loading.close();
}

//請求攔截
axios.interceptors.request.use(
  config => {
    startLoading();

    if (localStorage.eleToken) {
      //设置请求头
      config.headers.Authorization = localStorage.eleToken;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

//相應攔截
axios.interceptors.response.use(
  response => {
    endLoading();
    return response;
  },
  error => {
    endLoading();
    Message.error(error.response.data);

    //获取错误状态码

    const { status } = error.response;

    if (status == 401) {
      Message.error('token失效，請重新登錄！');
      //清除token
      localStorage.removeItem('eleToken');
      //跳轉回登錄頁面
      router.push('/login');
    }

    return Promise.reject(error);
  }
);

export default axios;
