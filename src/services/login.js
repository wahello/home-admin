import { request } from 'umi';

const LoginApi = {
  login: async (data) => {
    return request('/api/login', {
      method: 'POST',
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
    return request('/api/currentUser', {
      data,
    });
  },
};
export default LoginApi;
