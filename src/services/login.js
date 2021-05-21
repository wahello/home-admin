import { request } from 'umi';

const LoginApi = {
  login: async (data) => {
    return request('user/pub/login', {
      data,
    });
  },
  logout: async (data) => {
    return request('user/pub/logout', {
      data,
    });
  },
  getNeedCaptcha: async (data) => {
    return request('user/getNeedCaptcha', {
      method: 'POST',
      data,
    });
  },
  createCaptcha: async (data) => {
    return request('user/createCaptcha', {
      data,
    });
  },
  currentUser: async (data) => {
    return request('user/kh/getMyUserInfo', {
      data,
    });
  },
};
export default LoginApi;
