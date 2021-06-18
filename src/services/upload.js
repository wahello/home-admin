import { request } from 'umi';

const UploadApi = {
  pre: async (type) => {
    return request('/api/upload/pre', {
      params: {
        type,
      },
    });
  },
};
export default UploadApi;
