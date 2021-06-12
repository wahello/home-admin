import { request } from 'umi';

const ServiceCategoryApi = {
  add: async (data) => {
    return request('/api/item/category', {
      method: 'PUT',
      data,
    });
  },
  update: async (data) => {
    return request('/api/item/category', {
      method: 'POST',
      data,
    });
  },
  list: async () => {
    return request('/api/item/category/list');
  },
  get: async (id) => {
    return request(`/api/item/category/${id}`);
  },
  remove: async (id) => {
    return request(`/api/item/category/${id}`, {
      method: 'DELETE',
    });
  },
};
export default ServiceCategoryApi;
