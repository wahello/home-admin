import { request } from 'umi';

const MemberApi = {
  dashboard: async (data) => {
    return request('admin/member/sys/dashboard', { data });
  },

  page: async (data) => {
    return request('/api/member/page', {
      method: 'POST',
      data,
    });
  },
  get: async (id) => {
    return request(`/api/member/${id}`);
  },
  update: async (data) => {
    return request(`/api/member`, {
      method: 'POST',
      data,
    });
  },
  pageCoupon: async (id, data) => {
    return request(`/api/member/${id}/pageCoupon`, {
      method: 'POST',
      data,
    });
  },
  pageAccount: async (id, data) => {
    return request(`/api/member/${id}/pageAccount`, {
      method: 'POST',
      data,
    });
  },
  pageOrder: async (id, data) => {
    return request(`/api/member/${id}/pageOrder`, {
      method: 'POST',
      data,
    });
  },
  pageAddress: async (id, data) => {
    return request(`/api/member/${id}/pageAddress`, {
      method: 'POST',
      data,
    });
  },
  sendCoupon: async (id, data) => {
    return request(`/api/member/${id}/sendCoupon`, {
      method: 'PUT',
      data,
    });
  },
  updateAddress: async (data) => {
    return request(`/api/member/updateAddress`, {
      method: 'POST',
      data,
    });
  },
  adjustAccount: async (id, data) => {
    return request(`/api/member/${id}/adjustAccount`, {
      method: 'POST',
      data,
    });
  },
};
export default MemberApi;
