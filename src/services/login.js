import { request } from 'umi';

const LoginApi = {
  login: async (data) => {
    return request('user/pub/login', {
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
    return request('admin/user/kh/currentUser', {
      data,
    });
  },
};
export default LoginApi;
