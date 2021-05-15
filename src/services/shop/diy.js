import { request } from 'umi';

const DiyApi = {
  updateHome: async (data) => {
    return request('admin/diy/sys/updateHome', { data });
  },
  getHome: async (data) => {
    return request('admin/diy/sys/getHome', { data });
  },
  update: async (data) => {
    return request('admin/diy/sys/update', { data });
  },
  page: async (data) => {
    return request('admin/diy/sys/page',{data});
  },
  get: async (data) => {
    return request('admin/diy/sys/get', { data });
  },
  remove: async (data) => {
    return request('admin/diy/sys/remove', { data });
  },
  changeState: async (data) => {
    return request('admin/diy/sys/changeState', { data });
  },
  copy: async (data) => {
    return request('admin/diy/sys/copy', { data });
  },
};
export default DiyApi;
