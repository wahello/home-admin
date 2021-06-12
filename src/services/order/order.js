import { request } from 'umi';

const OrderApi = {

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
    return request('/api/order/single/page',{
      method: 'POST',
      data
    });
  },
  get: async (orderId) => {
    return request(`/api/order/single/${orderId}`);
  },
  saveAdjustItems: async (data) => {
    return request('admin/order/sys/saveAdjustItems', { data });
  },
  changeState: async (data) => {
    return request('admin/order/sys/changeState', { data });
  },
  cancel: async (data) => {
    return request('admin/order/sys/cancel', { data });
  },
};
export default OrderApi;
