import { request } from 'umi';

const AccountApi = {
  login: async (data) => {
    return request('/api/account/login', {
      method: 'POST',
      data,
    });
  },
  register: async (data) => {
    return request('/api/account/register', {
      method: 'PUT',
      data,
    });
  },
  logout: async (data) => {
    return request('user/pub/logout', {
      data,
    });
  },
  currentUser: async (data) => {
    return request('/api/account/info', {
      data,
    });
  },
  registerCode: async (params) => {
    return request('/api/account/registerCode', {
      params,
    });
  },
};
export default AccountApi;
