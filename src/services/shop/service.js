import { request } from 'umi';

const ServiceApi = {
  add: async (data) => {
    return request('/api/item', {
      method: 'PUT',
      data,
    });
  },
  update: async (data) => {
    return request('/api/item', {
      method: 'POST',
      data,
    });
  },
  page: async (data) => {
    return request('/api/item/page', {
      method: 'POST',
      data,
    });
  },
  get: async (id) => {
    return request(`/api/item/${id}`);
  },
  remove: async (data) => {
    return request('admin/service/sys/remove', { data });
  },
  changeState: async (data) => {
    return request('/api/item/changeState', {
      method: 'POST',
      data
    });
  },
  copy: async (data) => {
    return request('admin/service/sys/copy', { data });
  },
};
export default ServiceApi;
