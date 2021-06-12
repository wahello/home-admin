import { request } from 'umi';

const CouponApi = {
  add: async (data) => {
    return request('/api/coupon', {
      method: 'PUT',
      data,
    });
  },
  update: async (data) => {
    return request('/api/coupon', {
      method: 'POST',
      data,
    });
  },
  page: async (data) => {
    return request('/api/coupon/page', {
      method: 'POST',
      data,
    });
  },
  list: async () => {
    return request('/api/coupon/list');
  },
  get: async (id) => {
    return request(`/api/coupon/${id}`);
  },
  remove: async (id) => {
    return request(`/api/coupon/${id}`, { method: 'DELETE' });
  },
  copy: async (data) => {
    return request('admin/promotion/coupon/sys/copy', { data });
  },
};
export default CouponApi;
