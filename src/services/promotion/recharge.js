import { request } from 'umi';

const RechargeApi = {
  add: async (data) => {
    return request('admin/promotion/recharge/sys/add', { data });
  },
  update: async (data) => {
    return request('admin/promotion/recharge/sys/update', { data });
  },
  page: async (data) => {
    return request('admin/promotion/recharge/sys/page',{data});
  },
  pageRecord: async (data) => {
    return request('/api/recharge/pageRecord',{
      method: 'POST',
      data
    });
  },
  get: async (data) => {
    return request('admin/promotion/recharge/sys/get', { data });
  },
  remove: async (data) => {
    return request('admin/promotion/recharge/sys/remove', { data });
  },
  changeState: async (data) => {
    return request('admin/promotion/recharge/sys/changeState', { data });
  },
};
export default RechargeApi;
