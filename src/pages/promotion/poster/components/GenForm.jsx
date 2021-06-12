import React from 'react';
import PropTypes from 'prop-types';
import { ModalForm, ProFormDigit, ProFormRadio } from '@ant-design/pro-form';
import { Form, message } from 'antd';
import PosterApi from '@/services/promotion/poster';
import dayjs from 'dayjs';

const loadImg = (url) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = url;
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      resolve(image);
    };
    image.onerror = (e) => {
      console.log(e);
      reject(new Error('加载图片失败'));
    };
  });
};
const GenForm = ({ poster, visible, onVisibleChange }) => {

  const [form] = Form.useForm();

  const genPic = async (backgroundImg, code) => {
    const canvas = document.createElement('canvas');
    const downLink = document.createElement('a');
    try {
      canvas.style.position = 'fixed';
      canvas.style.opacity = '0';
      document.body.appendChild(canvas);
      canvas.width = backgroundImg.naturalWidth;
      canvas.height = backgroundImg.naturalHeight;
      const content = canvas.getContext('2d');
      content.rect(0, 0, content.width, content.height);
      content.fillStyle = '#fff';
      content.fill();
      content.drawImage(backgroundImg, 0, 0);
      const qrCode = await loadImg(code);
      content.drawImage(qrCode, poster.code.left, poster.code.top, poster.code.size, poster.code.size);
      const canvasUrl = canvas.toDataURL('image/png');
      document.body.appendChild(downLink);
      downLink.download = poster.name + dayjs().format('YYYY-MM-DD'); // 设置下载的文件名
      downLink.href = canvasUrl;
      downLink.click();
    } finally {
      canvas.remove();
      downLink.remove();
    }
  };

  const onSubmit = async values => {
    const hide = message.loading('生成海报中，请耐心等待');
    try {
      const { data: codeArr } = await PosterApi.gen({
        posterId: poster.id,
        ...values,
      });
      const backgroundImg = await loadImg(poster.pic);
      await Promise.all(codeArr.map(it => genPic(backgroundImg, it)));

      hide();
      message.success('生成海报成功');
    } catch (e) {
      console.error(e);
      hide();
    } finally {
      canvas.remove();
      downLink.remove();
    }
  };
  return (
    <ModalForm form={form} width={500} title='生成海报' visible={visible} layout={'horizontal'}
               labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}
               onVisibleChange={onVisibleChange}
               onFinish={onSubmit} modalProps={{ centered: true }}>

      <ProFormRadio.Group
        width='md'
        name='type'
        label='用途'
        initialValue={'NORMAL'}
        options={[{ label: '普通', value: 'NORMAL' }, { label: '渠道推广', value: 'CHANNEL' }]}
        extra={'普通不绑定邀请码，渠道推广包含邀请码，第一个扫码的客户会默认成为渠道客户，后续所有通过该海报注册的用户皆为该渠道客户的邀请用户'}
      />
      <ProFormDigit name={'num'} width={'xs'} max={10} min={1} initialValue={1} fieldProps={{ precision: 0 }}
                    label={'生成数量'} />
    </ModalForm>
  );
};

GenForm.propTypes =
  {
    poster: PropTypes.object,
    visible: PropTypes.bool.isRequired,
    onVisibleChange: PropTypes.func.isRequired,
  };

export default GenForm;
