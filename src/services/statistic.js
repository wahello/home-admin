import { request } from 'umi';

const StatisticApi = {
  todayData: async () => {
    return request('/api/analysis/dashboard');
  },
  orderData: async (params) => {
    return request('/api/analysis/orderData', { params });
  },
  serviceData: async () => {
    return request('/api/analysis/serviceData');
  },
};
export default StatisticApi;
