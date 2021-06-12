import { request } from 'umi';

const WithdrawApi = {

  page: async (data) => {
    return request('/api/withdraw/page', {
      method: 'POST',
      data,
    });
  },
  check: async (id,data) => {
    return request(`/api/withdraw/${id}/check`, {
      method: 'POST',
      data,
    });
  },
  trans: async (id,data) => {
    return request(`/api/withdraw/${id}/trans`, {
      method: 'POST',
      data,
    });
  },
};
export default WithdrawApi;
