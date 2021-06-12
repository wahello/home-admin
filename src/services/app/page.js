import { request } from 'umi';

const PageApi = {
  updateHome: async (data) => {
    return request('/api/page/updateHome', {
      method: 'POST',
      data,
    });
  },
  getHome: async () => {
    return request(`/api/page/getHome`);
  },
  schema: async (id) => {
    return request(`/api/page/${id}/schema`);
  },
  qrCode: async (id) => {
    return request(`/api/page/${id}/qrCode`);
  },
  update: async (data) => {
    return request('/api/page', {
      method: 'POST',
      data,
    });
  },
  add: async (data) => {
    return request(`/api/page`, {
      method: 'PUT',
      data,
    });
  },
  page: async (data) => {
    return request('/api/page/page', {
      method: 'POST',
      data,
    });
  },
  get: async (id) => {
    return request(`/api/page/${id}`);
  },
  remove: async (id) => {
    return request(`/api/page/${id}`, {
      method: 'DELETE',
    });
  },
  changeHome: async (id) => {
    return request(`/api/page/${id}/changeHome`);
  },
};
export default PageApi;
