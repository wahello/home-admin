import { request } from 'umi';

const ServiceCategoryApi = {
  add: async (data) => {
    return request('admin/service-category/sys/add', { data });
  },
  update: async (data) => {
    return request('admin/service-category/sys/update', { data });
  },
  list: async () => {
    return request('admin/service-category/sys/list');
  },
  get: async (data) => {
    return request('admin/service-category/sys/get', { data });
  },
  remove: async (data) => {
    return request('admin/service-category/sys/remove', { data });
  },
};
export default ServiceCategoryApi;
