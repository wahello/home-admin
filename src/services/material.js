import { request } from 'umi';

const MaterialApi = {
  add: async (data) => {
    return request('admin/material/sys/add', { data });
  },
  update: async (data) => {
    return request('admin/material/sys/update', { data });
  },
  page: async (data) => {
    return request('admin/material/sys/page',{data});
  },
  remove: async (data) => {
    return request('admin/material/sys/remove', { data });
  },
};
export default MaterialApi;
