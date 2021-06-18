import { request } from 'umi';

const OrderApi = {

  updateInfo: async (id, data) => {
    return request(`/api/order/single/${id}/updateInfo`, {
      method: 'POST',
      data,
    });
  },
  statisticsCount: async () => {
    return request(`/api/order/single/statisticsCount`);
  },
  confirm: async (id) => {
    return request(`/api/order/single/${id}/confirm`);
  },
  service: async (id) => {
    return request(`/api/order/single/${id}/service`);
  },
  serviceFinish: async (id) => {
    return request(`/api/order/single/${id}/serviceFinish`);
  },
  payOffline: async (id, data) => {
    return request(`/api/order/single/${id}/payOffline`, {
      method: 'POST',
      data,
    });
  },
  page: async (data) => {
    return request('/api/order/single/page', {
      method: 'POST',
      data,
    });
  },
  get: async (orderId) => {
    return request(`/api/order/single/${orderId}`);
  },
  saveAdjustItems: async (id, data) => {
    return request(`/api/order/single/${id}/adjust`, {
      method: 'POST',
      data,
    });
  },
  changeState: async (data) => {
    return request('admin/order/sys/changeState', { data });
  },
  refund: async (data) => {
    return request('/api/order/single/refund', {
      method: 'POST',
      data,
    });
  },
};
export default OrderApi;
