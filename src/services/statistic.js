import { request } from 'umi';

const StatisticApi = {
  todayData: async () => {
    return request('admin/statistic/sys/todayData');
  },
};
export default StatisticApi;
