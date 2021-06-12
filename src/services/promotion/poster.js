import { request } from 'umi';

const PosterApi = {
  add: async (data) => {
    return request('/api/poster', {
      method: 'PUT',
      data,
    });
  },
  update: async (data) => {
    return request('/api/poster', {
      method: 'POST',
      data,
    });
  },
  page: async (data) => {
    return request('/api/poster/page', {
      method: 'POST',
      data,
    });
  },
  get: async (id) => {
    return request(`/api/poster/${id}`, {
      method: 'GET',
    });
  },
  remove: async (id) => {
    return request(`/api/poster/${id}`, {
      method: 'DELETE',
    });
  },
  gen: async (data) => {
    return request('/api/poster/gen', {
      method: 'POST',
      data,
    });
  },
};
export default PosterApi;
