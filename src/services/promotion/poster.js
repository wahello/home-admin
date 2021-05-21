import { request } from 'umi';

const PosterApi = {
  add: async (data) => {
    return request('admin/promotion/poster/sys/add', { data });
  },
  update: async (data) => {
    return request('admin/promotion/poster/sys/update', { data });
  },
  page: async (data) => {
    return request('admin/promotion/poster/sys/page',{data});
  },
  get: async (data) => {
    return request('admin/promotion/poster/sys/get', { data });
  },
  remove: async (data) => {
    return request('admin/promotion/poster/sys/remove', { data });
  },
  gen: async (data) => {
    return request('admin/promotion/poster/sys/gen', { data });
  },
};
export default PosterApi;
