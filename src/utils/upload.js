import request from 'umi-request';
import MaterialApi from '@/services/material';


const UploadUtil = {
  uploadFile: async (file) => {
    try {
      const { data } = await MaterialApi.preUpload();
      const formData = new FormData();
      formData.append('OSSAccessKeyId', data.accessid);
      formData.append('Content-Disposition', "inline");
      formData.append('Signature', data.signature);
      formData.append('host', data.host);
      const fileUrl = data.dir + Date.now() + file.name.slice(file.name.lastIndexOf('.'));
      formData.append('key', fileUrl);
      formData.append('policy', data.policy);
      formData.append('success_action_status', 200);
      formData.append('file', file);
      await request(data.host, {
        method: 'POST',
        skipErrorHandler: true,
        data: formData,
      });
      return `${data.host}/${fileUrl}`;
    } catch (e) {
      throw new Error('上传失败');
    }
  },
};

export default UploadUtil;
