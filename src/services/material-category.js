import { request } from 'umi';

const MaterialCategoryApi = {
  get: async (data) => {
    return request('admin/material-category/sys/get', { data });
  },
  add: async (data) => {
    return request('admin/material-category/sys/add', { data });
  },
  update: async (data) => {
    return request('admin/material-category/sys/update', { data });
  },
  list: async () => {
    return request('admin/material-category/sys/list');
  },
  remove: async (data) => {
    return request('admin/material-category/sys/remove', { data });
  },
};
export default MaterialCategoryApi;
