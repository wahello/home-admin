import { request } from 'umi';

const CouponApi = {
  add: async (data) => {
    return request('admin/promotion/coupon/sys/add', { data });
  },
  update: async (data) => {
    return request('admin/promotion/coupon/sys/update', { data });
  },
  page: async (data) => {
    return request('admin/promotion/coupon/sys/page', { data });
  },
  list: async () => {
    return request('admin/promotion/coupon/sys/list');
  },
  get: async (data) => {
    return request('admin/promotion/coupon/sys/get', { data });
  },
  remove: async (data) => {
    return request('admin/promotion/coupon/sys/remove', { data });
  },
  copy: async (data) => {
    return request('admin/promotion/coupon/sys/copy', { data });
  },
};
export default CouponApi;
