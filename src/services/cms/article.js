import { request } from 'umi';

const ArticleApi = {
  add: async (data) => {
    return request('admin/article/sys/add', { data });
  },
  update: async (data) => {
    return request('admin/article/sys/update', { data });
  },
  page: async (data) => {
    return request('admin/article/sys/page', { data });
  },
  get: async (data) => {
    return request('admin/article/sys/get', { data });
  },
  remove: async (data) => {
    return request('admin/article/sys/remove', { data });
  },
};
export default ArticleApi;
