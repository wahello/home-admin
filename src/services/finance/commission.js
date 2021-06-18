import { request } from 'umi';

const CommissionApi = {

  page: async (data) => {
    return request('/api/rebate/pageRecord', {
      method: 'POST',
      data,
    });
  },
};
export default CommissionApi;
