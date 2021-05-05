import { request } from 'umi';

const OrderApi = {
  add: async (data) => {
    return request('admin/order/sys/add', { data });
  },
  updateAddress: async (data) => {
    return request('admin/order/sys/updateAddress', { data });
  },
  confirm: async (data) => {
    return request('admin/order/sys/confirm', { data });
  },
  service: async (data) => {
    return request('admin/order/sys/service', { data });
  },
  serviceFinish: async (data) => {
    return request('admin/order/sys/serviceFinish', { data });
  },
  payOffline: async (data) => {
    return request('admin/order/sys/payOffline', { data });
  },
  page: async (data) => {
    return request('admin/order/sys/page',{data});
  },
  get: async (data) => {
    return request('admin/order/sys/get', { data });
  },
  saveAdjustItems: async (data) => {
    return request('admin/order/sys/saveAdjustItems', { data });
  },
  changeState: async (data) => {
    return request('admin/order/sys/changeState', { data });
  },
  copy: async (data) => {
    return request('admin/order/sys/copy', { data });
  },
};
export default OrderApi;
