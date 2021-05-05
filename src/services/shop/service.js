import { request } from 'umi';

const ServiceApi = {
  add: async (data) => {
    return request('admin/service/sys/add', { data });
  },
  update: async (data) => {
    return request('admin/service/sys/update', { data });
  },
  page: async (data) => {
    return request('admin/service/sys/page',{data});
  },
  get: async (data) => {
    return request('admin/service/sys/get', { data });
  },
  remove: async (data) => {
    return request('admin/service/sys/remove', { data });
  },
  changeState: async (data) => {
    return request('admin/service/sys/changeState', { data });
  },
  copy: async (data) => {
    return request('admin/service/sys/copy', { data });
  },
};
export default ServiceApi;
