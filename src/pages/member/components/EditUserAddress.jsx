import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { ModalForm, ProFormField, ProFormSelect, ProFormSwitch } from '@ant-design/pro-form';
import { Form } from 'antd';
import CouponApi from '@/services/promotion/coupon';
import Enums from '@/utils/enums';
import MemberApi from '@/services/member';

const EditUserAddress = ({ address, visible, onVisibleChange, onFinish }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (address) {
      form.setFieldsValue(address);
    }
  }, [address]);
  const onSubmit = async (values) => {
    await MemberApi.updateUserAddress({ addressId: address._id, address: values });
    return onFinish();
  };
  return (
    <ModalForm form={form} width={400} title={'修改用户地址'} visible={visible} onVisibleChange={onVisibleChange}
               onFinish={onSubmit}>
      <ProFormField
        width={'md'}
        name='name'
        label='联系人'
        placeholder='请输入联系人'
        rules={[{ required: true, message: '请输入联系人' }]}
      />
      <ProFormField
        width={'md'}
        name='mobile'
        label='联系方式'
        fieldProps={{
          maxLength:11
        }}
        placeholder='请输入联系方式'
        rules={[{ required: true, message: '请输入联系方式' }]}
      />

      <ProFormField
        width={'md'}
        name='location'
        label='地址'
        placeholder='请输入地址'
        rules={[{ required: true, message: '请输入地址' }]}
      />
      <ProFormSwitch
        width={'md'}
        name='default_flag'
        label='是否默认'
      />

    </ModalForm>
  );
};

EditUserAddress.propTypes = {
  userId: PropTypes.string,
  visible: PropTypes.bool.isRequired,
  onFinish: PropTypes.func.isRequired,
  onVisibleChange: PropTypes.func.isRequired,
};

export default EditUserAddress;
