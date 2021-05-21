import { request } from 'umi';

const StatisticApi = {
  todayData: async () => {
    return request('admin/statistic/sys/todayData');
  },
  orderData: async (data) => {
    return request('admin/statistic/sys/orderData', { data });
  }, serviceData: async (data) => {
    return request('admin/statistic/sys/serviceData');
  },
};
export default StatisticApi;
