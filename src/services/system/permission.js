import { request } from 'umi';

const PermissionApi = {
  list: async () => {
    return request('admin/permission/sys/list');
  },
  add: async (data) => {
    return request('admin/permission/sys/add', {
      data,
    });
  },
  update: async (data) => {
    return request('admin/permission/sys/update', {
      data,
    });
  },

  get: async (data) => {
    return request('admin/permission/sys/get', {
      data,
    });
  },
  remove: async (data) => {
    return request('admin/permission/sys/remove', {
      data,
    });
  },
  page: async (data) => {
    return request('admin/permission/sys/page', {
      data,
    });
  },
};
export default PermissionApi;
