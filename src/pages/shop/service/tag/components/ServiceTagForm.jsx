import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { useRequest } from 'umi';
import { Form, Spin } from 'antd';
import ServiceTagApi from '@/services/shop/service-tag';

const ServiceTagForm = ({ id, visible, onVisibleChange, onFinish }) => {
  const [form] = Form.useForm();
  const { data, loading, error } = useRequest(() => {
    return id ? ServiceTagApi.get({ id }) : Promise.resolve();
  }, {
    refreshDeps: [id],
  });
  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    }
  }, [data]);


  const onSubmit = async values => {
    if (id) {
      const updateData = { ...values, id };
      await ServiceTagApi.update(updateData);
    } else {
      await ServiceTagApi.add(values);
    }

    return onFinish();
  };
  return (
    <ModalForm form={form} submitter={{
      submitButtonProps: {
        disabled: loading || error,
      },
    }} width={400} title={id ? '修改标签' : '新建标签'} visible={visible} onVisibleChange={onVisibleChange}
               onFinish={onSubmit}
               labelCol={{ span: 6 }}
               wrapperCol={{ span: 18 }}
               layout={'horizontal'}
               modalProps={{
                 maskClosable: false,
               }}
    >
      <Spin spinning={loading}>
        <ProFormText
          width='md'
          name='name'
          label='标签名称'
          placeholder='请输入标签名称'
          rules={[{ required: true, message: '不能为空' }, { max: 20, message: '不能超过20个字符' }]}
        />
        <ProFormTextArea
          width='md'
          name='desc'
          label='标签描述'
          placeholder='请输入标签描述'
        />

      </Spin>
    </ModalForm>
  );
};

ServiceTagForm.propTypes =
  {
    id: PropTypes.string,
    visible: PropTypes.bool.isRequired,
    onFinish:
    PropTypes.func.isRequired,
    onVisibleChange: PropTypes.func.isRequired,
  }
;

export default ServiceTagForm;
