import { request } from 'umi';

const GroupApi = {
  add: async (data) => {
    return request('admin/promotion/group/sys/add', { data });
  },
  update: async (data) => {
    return request('admin/promotion/group/sys/update', { data });
  },
  changeState: async (data) => {
    return request('admin/promotion/group/sys/changeState', { data });
  },
  page: async (data) => {
    return request('admin/promotion/group/sys/page',{data});
  },  pageRecord: async (data) => {
    return request('admin/promotion/group/sys/pageRecord',{data});
  },
  get: async (data) => {
    return request('admin/promotion/group/sys/get', { data });
  },
  remove: async (data) => {
    return request('admin/promotion/group/sys/remove', { data });
  },
  copy: async (data) => {
    return request('admin/promotion/group/sys/copy', { data });
  },
};
export default GroupApi;
