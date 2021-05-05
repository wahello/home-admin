import { request } from 'umi';

const ServiceTagApi = {
  add: async (data) => {
    return request('admin/service-tag/sys/add', { data });
  },
  update: async (data) => {
    return request('admin/service-tag/sys/update', { data });
  },
  list: async () => {
    return request('admin/service-tag/sys/list');
  },
  get: async (data) => {
    return request('admin/service-tag/sys/get', { data });
  },
  remove: async (data) => {
    return request('admin/service-tag/sys/remove', { data });
  },
};
export default ServiceTagApi;
