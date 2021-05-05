import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { Form } from 'antd';
import OrderApi from '@/services/order/order';

const EditAddressForm = ({ id, visible, onVisibleChange, onFinish, address }) => {
  const [form] = Form.useForm();
  useEffect(()=>{
      form.setFieldsValue({...address})
  },[address])
  const onSubmit = async values => {
    await OrderApi.updateAddress({ id, address: values });
    return onFinish();
  };
  return (
    <ModalForm form={form} width={400} title={'修改地址'} visible={visible} onVisibleChange={onVisibleChange}
               onFinish={onSubmit} initialValues={address}>
      <ProFormText
        width='md'
        name='name'
        label='联系人'
        placeholder='请输入联系人'
        rules={[{ required: true, message: '不能为空' }]}
      />
      <ProFormText
        width='md'
        name='mobile'
        label='联系方式'
        placeholder='请输入联系方式'
        rules={[{ required: true, message: '不能为空' }]}
      />
      <ProFormText
        width='md'
        name='location'
        label='地址'
        placeholder='请输入地址'
        rules={[{ required: true, message: '不能为空' }]}
      />
    </ModalForm>
  );
};

EditAddressForm.propTypes = {
  id: PropTypes.string,
  address: PropTypes.object,
  visible: PropTypes.bool.isRequired,
  onFinish: PropTypes.func.isRequired,
  onVisibleChange: PropTypes.func.isRequired,
}
;
export default EditAddressForm;
