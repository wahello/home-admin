import moment from 'moment';
import Crypto from 'crypto-js';
import request from 'umi-request';
import { message } from 'antd';


const sign = (e) => {
  const n = Object.keys(e).sort().map(it => `${it}=${e[it]}`).join('&');
  return Crypto.HmacMD5(n, '15W5vHHtDpb3oeg8U+qPKg==').toString();
};
const requestCloud = (method, params = {}, token) => {
  const requestData = {
    method,
    params: JSON.stringify(params),
    spaceId: '6330733a-7e48-4972-9c93-39caf08ddb2a',
    timestamp: moment().valueOf(),
  };
  if (token) {
    requestData.token = token;
  }
  const headers = {
    'x-serverless-sign': sign(requestData),
  };
  if (token) {
    headers['x-basement-token'] = token;
  }
  return request('https://api.bspapp.com/client', {
    method: 'POST',
    data: requestData,
    skipErrorHandler: true,
    headers,
  });
};

const UploadUtil = {
  uploadFile: async (file) => {
    try {
      const { data: { accessToken } } = await requestCloud('serverless.auth.user.anonymousAuthorize', {});
      const { data: ossConfig } = await requestCloud('serverless.file.resource.generateProximalSign', {
        env: 'public',
        filename: file.name,
      }, accessToken);
      const formData = new FormData();
      formData.append('OSSAccessKeyId', ossConfig.accessKeyId);
      formData.append('Signature', ossConfig.signature);
      formData.append('host', ossConfig.host);
      formData.append('id', ossConfig.id);
      formData.append('key', ossConfig.ossPath);
      formData.append('policy', ossConfig.policy);
      formData.append('success_action_status', 200);
      formData.append('file', file);
      await request(`https://${ossConfig.host}`, {
        method: 'POST',
        skipErrorHandler: true,
        data: formData,
      });
      await requestCloud('serverless.file.resource.report', { id: ossConfig.id }, accessToken);
      return `https://${ossConfig.cdnDomain}/${ossConfig.ossPath}`;
    } catch (e) {
      throw new Error('上传失败');
    }
  },
};

export default UploadUtil;
