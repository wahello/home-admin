import { request } from 'umi';

const TenantApi = {
  info: async () => {
    return request('/api/tenant/info');
  },
  discernLicence: async (data) => {
    return request('/api/tenant/discernLicence',{
      method: 'POST',
      data
    });
  },
  discernIdCard: async (data) => {
    return request('/api/tenant/discernIdCard',{
      method: 'POST',
      data
    });
  },
  validMp: async (data) => {
    return request('/api/tenant/validMp',{
      method: 'POST',
      data
    });
  },
  saveBase: async (data) => {
    return request('/api/tenant/saveBase',{
      method: 'POST',
      data
    });
  },
  auth: async (data) => {
    return request('/api/tenant/auth',{
      method: 'POST',
      data
    });
  },
  saveMp: async (data) => {
    return request('/api/tenant/saveMp',{
      method: 'POST',
      data
    });
  }
};
export default TenantApi;
