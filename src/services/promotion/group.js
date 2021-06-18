import { request } from 'umi';

const GroupApi = {
  add: async (data) => {
    return request('/api/group', {
      method: 'PUT',
      data,
    });
  },
  update: async (data) => {
    return request('/api/group', {
      method: 'POST',
      data,
    });
  },
  changeState: async (data) => {
    return request(`/api/group/changeState`, { method: 'POST', data });
  },
  page: async (data) => {
    return request('/api/group/page', {
      method: 'POST',
      data,
    });
  },
  pageRecord: async (data) => {
    return request('/api/group/pageRecord', { method: 'POST', data });
  },
  get: async (id) => {
    return request(`/api/group/${id}`);
  },
  remove: async (id) => {
    return request(`/api/group/${id}`, {
      method: 'DELETE',
    });
  },
  copy: async (data) => {
    return request('admin/promotion/group/sys/copy', { data });
  },
};
export default GroupApi;
