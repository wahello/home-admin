import { request } from 'umi';

const EvaluateApi = {
  page: async (data) => {
    return request('admin/evaluate/sys/page', { data });
  },
  toggleShow: async (data) => {
    return request('admin/evaluate/sys/toggleShow', { data });
  },

};
export default EvaluateApi;
