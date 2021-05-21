import { request } from 'umi';

const WithdrawApi = {

  page: async (data) => {
    return request('admin/withdraw/sys/page',{data});
  },
  check: async (data) => {
    return request('admin/withdraw/sys/check',{data});
  },
  trans: async (data) => {
    return request('admin/withdraw/sys/trans',{data});
  },
};
export default WithdrawApi;
