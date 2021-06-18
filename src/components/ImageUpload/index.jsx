import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useBoolean, useControllableValue } from 'ahooks';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import UploadUtil from '@/utils/upload';
import { Image, message, Upload } from 'antd';

const validImage = (file) => {
  return file.type === 'image/jpeg' || file.type === 'image/png';
};

const OssUpload = props => {

  const [fileUrl, setFileUrl] = useControllableValue(props);
  const [loading, toggleLoading] = useBoolean(false);

  const beforeUpload = file => {
    if (props.isImg && !validImage(file)) {
      message.error('请选择jpg、png类型图片');
      return false;
    }
    if (props.maxSize) {
      if (file.size > props.maxSize * 1024 * 1024) {
        message.error(`文件不能超过${props.maxSize}MB`);
        return false;
      }
    }
    return true;
  };

  const onFileChange = e => {
    if (e.file.status === 'done') {
      setFileUrl(e.file.response);
    }
  };
  const customRequest = async ({
                                 file,
                                 onError,
                                 onSuccess,
                               }) => {

    try {
      toggleLoading.setTrue();
      const url = await UploadUtil.uploadFile(file, props.type);
      message.success('上传成功');
      onSuccess(url);
    } catch (e) {
      message.error(e.message);
      onError(e, file);
    } finally {
      toggleLoading.setFalse();
    }
  };

  const defaultUpload = useMemo(() => {
    return fileUrl ? <Image src={fileUrl} width={100} height={100} preview={false} style={{ objectFit: 'cover' }} /> :
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>{loading ? '上传中' : (props.text || '上传')}</div>
      </div>;

  }, [fileUrl, loading, props.text]);
  return <Upload
    listType={props.isImg ? 'picture-card' : 'text'}
    accept={props.accept}
    showUploadList={false}
    customRequest={customRequest}
    onChange={onFileChange}
    beforeUpload={beforeUpload}
  >
    {props.customRender ? props.customRender(fileUrl, loading) : defaultUpload}
  </Upload>;
};

OssUpload.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  maxSize: PropTypes.number,
  accept: PropTypes.string,
  text: PropTypes.string,
  isImg: PropTypes.bool,
  customRender: PropTypes.func,
  type: PropTypes.string,
};
OssUpload.defaultProps = {
  isImg: true,
  type: 'material',
};

export default OssUpload;
