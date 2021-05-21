import { request } from 'umi';

const CommissionApi = {

  page: async (data) => {
    return request('admin/finance/commission/sys/page',{data});
  },
};
export default CommissionApi;
