import { request } from 'umi';

const PageApi = {
  updateHome: async (data) => {
    return request('admin/app/page/sys/updateHome', { data });
  },
  getHome: async (data) => {
    return request('admin/app/page/sys/getHome', { data });
  },
  update: async (data) => {
    return request('admin/app/page/sys/update', { data });
  },
  add: async (data) => {
    return request('admin/app/page/sys/add', { data });
  },
  page: async (data) => {
    return request('admin/app/page/sys/page', { data });
  },
  get: async (data) => {
    return request('admin/app/page/sys/get', { data });
  },
  remove: async (data) => {
    return request('admin/app/page/sys/remove', { data });
  },
  changeHome: async (data) => {
    return request('admin/app/page/sys/changeHome', { data });
  },
};
export default PageApi;
