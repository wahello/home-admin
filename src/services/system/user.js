import { request } from 'umi';

const UserApi = {
  add: async (data) => {
    return request('admin/user/sys/add', {
      data,
    });
  },
  update: async (data) => {
    return request('admin/user/sys/update', {
      data,
    });
  },
  resetPassword: async (data) => {
    return request('admin/user/sys/resetPassword', {
      data,
    });
  },
  get: async (data) => {
    return request('admin/user/sys/get', {
      data,
    });
  },
  remove: async (data) => {
    return request('admin/user/sys/remove', {
      data,
    });
  },
  page: async (data) => {
    return request('admin/user/sys/page', {
      data
    });
  },
};
export default UserApi;
