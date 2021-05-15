import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Alert, Form, Space } from 'antd';
import OrderApi from '@/services/order/order';
import ProForm ,{ ModalForm, ProFormDependency, ProFormDigit, ProFormRadio } from '@ant-design/pro-form';
import Enums from '@/utils/enums';

const CancelOrderForm = ({ visible, onVisibleChange, onFinish, order }) => {

  const [form] = Form.useForm();

  const onSubmit = async (values) => {
    await OrderApi.cancel({ orderId:order._id, ...values });
    return onFinish();
  };

  const alertMessage = useMemo(() => {
    const orderState = Enums.orderState[order.state];
    if ([Enums.orderState.WAIT_PAY_PART, Enums.orderState.WAIT_PAY, Enums.orderState.WAIT_CONFIRM].includes(orderState)) {
      return <Space direction={'vertical'}>
        <span>若客户通过支付平台付款，则退款金额会通过支付平台退回</span>
        <span>若客户通过余额付款，则退款金额会退回到客户账户</span>
        <span>若客户通过线下付款，请主动联系客户进行退款</span>
        <span>若订单使用优惠券，也将退回到客户账户中。</span>
      </Space>;
    }
    return null;
  }, [order]);



  return (
    <ModalForm  layout={'horizontal'} form={form} width={500} title={'取消订单'}
               visible={visible} onVisibleChange={onVisibleChange}
               onFinish={onSubmit}
               submitter={{
                 searchConfig: {
                   submitText: '确认取消',
                   resetText:'取消'
                 },
                 submitButtonProps: {
                   type: 'primary',
                   danger: true,
                 },
               }}
    >
      <Alert type={'warning'} message={alertMessage} />
      <br />
      <ProForm.Item label={'订单状态'}>
        <span>{Enums.orderState[order.state]?.text}</span>
      </ProForm.Item>
      <ProForm.Item label={'已付金额'}>
        <span>￥{order.paid_fee}</span>
      </ProForm.Item>
      <ProFormRadio.Group
        name={'refundType'}
        label='退款方式'
        rules={[{ required: true }]}
        initialValue={'ALL'}
        options={[{ label: '全额退款', value: 'ALL' }, { label: '部分退款', value: 'PART' },{ label: '无需退款', value: 'NONE' }]}
      />
      <ProFormDependency name={['refundType']}>
        {({ refundType }) => {
          return refundType !== 'NONE' ? <ProFormDigit
            width='md'
            initialValue={order.paid_fee}
            max={order.paid_fee}
            min={0.01}
            readonly={refundType==='ALL'}
            name='refundMoney'
            label='退款金额'
            placeholder='不能超过订单已支付金额'
            rules={[{ required: true, message: '不能为空' }]}
          /> : null;
        }}
      </ProFormDependency>
    </ModalForm>
  );
};

CancelOrderForm.propTypes =
  {
    order: PropTypes.object,
    visible: PropTypes.bool.isRequired,
    onFinish: PropTypes.func.isRequired,
    onVisibleChange: PropTypes.func.isRequired,
  }
;

export default CancelOrderForm;
