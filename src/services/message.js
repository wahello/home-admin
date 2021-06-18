import { request } from 'umi';

const MessageApi = {
  all: async () => {
    return request('/api/message/all');
  },
};
export default MessageApi;
