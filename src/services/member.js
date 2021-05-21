import { request } from 'umi';

const MemberApi = {
  dashboard: async (data) => {
    return request('admin/member/sys/dashboard', { data });
  },

  page: async (data) => {
    return request('admin/member/sys/page',{data});
  },
  get: async (data) => {
    return request('admin/member/sys/get',{data});
  },
  update: async (data) => {
    return request('admin/member/sys/update', { data });
  },
  pageCoupon: async (data) => {
    return request('admin/member/sys/pageCoupon', {
      data
    });
  },
  pageAccount: async (data) => {
    return request('admin/member/sys/pageAccount', {
      data
    });
  },
  pageAddress: async (data) => {
    return request('admin/member/sys/pageAddress', {
      data
    });
  },
  sendCoupon: async (data) => {
    return request('admin/member/sys/sendCoupon', {
      data
    });
  },
  updateUserAddress: async (data) => {
    return request('admin/member/sys/updateUserAddress', {
      data
    });
  },
  adjustAccount: async (data) => {
    return request('admin/member/sys/adjustAccount', {
      data
    });
  }
};
export default MemberApi;
