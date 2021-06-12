import { request } from 'umi';

const MaterialApi = {
  add: async (data) => {
    return request('/api/material', {
      method: 'PUT',
      data,
    });
  },
  page: async (data) => {
    return request('/api/material/page', {
      method: 'POST',
      data,
    });
  },
  remove: async (data) => {
    return request(`/api/material/removeByIds`, {
      method: 'DELETE',
      data,
    });
  },
  move: async (data) => {
    return request('/api/material/move', {
      method: 'POST',
      data,
    });
  },
  preUpload: async () => {
    return request('/api/material/preUpload');
  },
};
export default MaterialApi;
