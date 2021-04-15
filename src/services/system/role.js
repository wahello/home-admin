import { request } from 'umi';

const RoleApi = {
  list: async () => {
    return request('admin/role/sys/list');
  },
};
export default RoleApi;
