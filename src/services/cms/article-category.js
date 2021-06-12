import { request } from 'umi';

const ArticleCategoryApi = {
  add: async (data) => {
    return request('admin/article-category/sys/add', { data });
  },
  update: async (data) => {
    return request('admin/article-category/sys/update', { data });
  },
  list: async () => {
    return request('admin/article-category/sys/list');
  },
  get: async (data) => {
    return request('admin/article-category/sys/get', { data });
  },
  remove: async (data) => {
    return request('admin/article-category/sys/remove', { data });
  },
};
export default ArticleCategoryApi;
