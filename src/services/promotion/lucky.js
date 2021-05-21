import { request } from 'umi';

const LuckyApi = {
  add: async (data) => {
    return request('admin/promotion/lucky/sys/add', { data });
  },
  update: async (data) => {
    return request('admin/promotion/lucky/sys/update', { data });
  },
  page: async (data) => {
    return request('admin/promotion/lucky/sys/page',{data});
  },
  pageRecord: async (data) => {
    return request('admin/promotion/lucky/sys/pageRecord',{data});
  },
  get: async (data) => {
    return request('admin/promotion/lucky/sys/get', { data });
  },
  remove: async (data) => {
    return request('admin/promotion/lucky/sys/remove', { data });
  },
};
export default LuckyApi;
