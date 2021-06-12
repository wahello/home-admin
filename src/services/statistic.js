import { request } from 'umi';

const StatisticApi = {
  todayData: async () => {
    return request('/api/analysis/dashboard');
  },
  orderData: async (data) => {
    return request('admin/statistic/sys/orderData', { data });
  },
  serviceData: async (data) => {
    return request('admin/statistic/sys/serviceData');
  },
};
export default StatisticApi;
