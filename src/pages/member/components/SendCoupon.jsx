import React from 'react';
import PropTypes from 'prop-types';
import { ModalForm } from '@ant-design/pro-form';
import { Form } from 'antd';
import MemberApi from '@/services/member';
import CouponSelect from '@/components/CouponSelect';

const SendCoupon = ({ memberId, visible, onVisibleChange, onFinish }) => {
  const [form] = Form.useForm();

  const onSubmit = async ({ couponId }) => {
    await MemberApi.sendCoupon(memberId,couponId);
    return onFinish();
  };
  return (
    <ModalForm form={form} width={400} title={'发放优惠券'} visible={visible} onVisibleChange={onVisibleChange}
               onFinish={onSubmit}>
      <CouponSelect
        width={'md'}
        name='couponId'
        label='选择要发放的优惠券'
        placeholder='请选择'
        rules={[{ required: true, message: '请选择优惠券' }]}
      />
    </ModalForm>
  );
};

SendCoupon.propTypes = {
  memberId: PropTypes.string,
  visible: PropTypes.bool.isRequired,
  onFinish: PropTypes.func.isRequired,
  onVisibleChange: PropTypes.func.isRequired,
};

export default SendCoupon;
