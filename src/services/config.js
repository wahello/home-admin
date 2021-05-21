import { request } from 'umi';

const ConfigApi = {
  save: async (data) => {
    return request('admin/config/sys/save', { data });
  },
  get: async (data) => {
    return request('admin/config/sys/get', { data });
  },
};
export default ConfigApi;
