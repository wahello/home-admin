import { request } from 'umi';

const MaterialCategoryApi = {
  get: async (id) => {
    return request(`/api/material/category/${id}`);
  },
  add: async (data) => {
    return request('/api/material/category', {
      method: 'PUT',
      data,
    });
  },
  update: async (data) => {
    return request('/api/material/category', {
      method: 'POST',
      data,
    });
  },
  list: async () => {
    return request('/api/material/category/list');
  },
  remove: async (id) => {
    return request(`/api/material/category/${id}`, {
      method: 'DELETE',
    });
  },
};
export default MaterialCategoryApi;
