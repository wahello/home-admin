import { request } from 'umi';

const ServiceTagApi = {
  add: async (data) => {
    return request('/api/item/tag', {
      method: 'PUT',
      data,
    });
  },
  update: async (data) => {
    return request('/api/item/tag', {
      method: 'POST',
      data,
    });
  },
  list: async () => {
    return request('/api/item/tag/list');
  },
  get: async (id) => {
    return request(`/api/item/tag/${id}`);
  },
  remove: async (id) => {
    return request(`/api/item/tag/${id}`, {
      method: 'DELETE',
    });
  },
};
export default ServiceTagApi;
