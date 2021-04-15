import { request } from 'umi';

const AppApi = {
  init: async (data) => {
    return request('/api/app/init', {
      method: 'POST',
      data,
    });
  },
};
export default AppApi;
