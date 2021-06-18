import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Alert, Form, Space } from 'antd';
import OrderApi from '@/services/order/order';
import ProForm, { ModalForm, ProFormDependency, ProFormDigit, ProFormRadio, ProFormText } from '@ant-design/pro-form';
import Enums from '@/utils/enums';

const CancelOrderForm = ({ visible, onVisibleChange, onFinish, order }) => {

  const [form] = Form.useForm();

  const onSubmit = async (values) => {
    await OrderApi.refund({ orderId: order.id, ...values });
    return onFinish();
  };

  const isApplyCancel = useMemo(() => {
    return order.state === Enums.orderState.CLOSING.value;
  }, [order]);


  useEffect(() => {
    if (order?.paidFee === 0) {
      form.setFieldsValue({
        refundType: 'NONE',
      });
    }
  }, [order]);

  const refundComponent = () => {
    return <>
      <ProFormRadio.Group
        name={'refundType'}
        label='退款方式'
        rules={[{ required: true }]}
        initialValue={'ALL'}
        options={[{ label: '全额退款', value: 'ALL' }, { label: '部分退款', value: 'PART' }, { label: '无需退款', value: 'NONE' }]}
      />
      <ProFormDependency name={['refundType']}>
        {({ refundType }) => {
          return refundType !== 'NONE' ? <ProFormDigit
            width='md'
            initialValue={order.paidFee}
            max={order.paidFee}
            min={0.01}
            readonly={refundType === 'ALL'}
            name='refundFee'
            label='退款金额'
            placeholder='不能超过订单已支付金额'
            rules={[{ required: true, message: '不能为空' }]}
          /> : null;
        }}
      </ProFormDependency>
    </>;
  };


  return (
    <ModalForm modalProps={{ centered: true }} layout={'horizontal'} form={form} width={500} title={'取消订单'}
               visible={visible} onVisibleChange={onVisibleChange}
               onFinish={onSubmit}
               submitter={{
                 searchConfig: {
                   submitText: '提交',
                   resetText: false,
                 },
                 submitButtonProps: {
                   type: 'primary',
                   danger: true,
                 },
               }}
    >
      <Alert type={'warning'} message={<Space direction={'vertical'}>
        <span>若客户通过支付平台付款，则退款金额会通过支付平台退回</span>
        <span>若客户通过余额付款，则退款金额会退回到客户账户</span>
        <span>若客户通过线下付款，请线下联系客户进行退款</span>
        <span>若订单有使用优惠券，也将退回到客户账户中。</span>
      </Space>} />
      <br />
      <ProForm.Item label={'订单状态'}>
        <span>{Enums.orderState[order.state]?.text}</span>
      </ProForm.Item>
      <ProForm.Item label={'已付金额'}>
        <span>￥{order.paidFee}</span>
      </ProForm.Item>
      {isApplyCancel && <ProFormRadio.Group
        name={'agreeRefund'}
        label='是否同意取消'
        rules={[{ required: true }]}
        initialValue={'true'}
        options={[{ label: '同意', value: 'true' }, { label: '驳回', value: 'false' }]}
      />}
      {isApplyCancel ? <ProFormDependency name={['agreeRefund']}>
        {({ agreeRefund }) => {
          return (agreeRefund === 'true') ? refundComponent() :
            <ProFormText name={'rejectCancelReason'} fieldProps={{ maxLength: 100 }} label={'驳回原因'}
                         rules={[{ required: true }]} />;
        }}
      </ProFormDependency> : refundComponent()
      }


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
