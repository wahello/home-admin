import { request } from 'umi';

const RoleApi = {
  list: async () => {
    return request('admin/role/sys/list');
  },
  add: async (data) => {
    return request('admin/role/sys/add', {
      data,
    });
  },
  update: async (data) => {
    return request('admin/role/sys/update', {
      data,
    });
  },

  get: async (data) => {
    return request('admin/role/sys/get', {
      data,
    });
  },
  remove: async (data) => {
    return request('admin/role/sys/remove', {
      data,
    });
  },
  page: async (data) => {
    return request('admin/role/sys/page', {
      data,
    });
  },
};
export default RoleApi;
