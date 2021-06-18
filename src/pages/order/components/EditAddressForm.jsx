import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ProForm, { ModalForm, ProFormDateTimePicker, ProFormDependency, ProFormText } from '@ant-design/pro-form';
import { Form } from 'antd';
import OrderApi from '@/services/order/order';
import ChooseLocation from '@/pages/order/components/ChooseLocation';

const EditAddressForm = ({  visible, onVisibleChange, onFinish, order }) => {
  const [form] = Form.useForm();
  useEffect(() => {
    if (order) {
      form.setFieldsValue({ appointTime: order.appointTime, ...order.address });
    }
  }, [order]);
  const onSubmit = async ({ appointTime,...address }) => {
    await OrderApi.updateInfo(order.id,{appointTime,address});
    return onFinish();
  };
  return (
    <ModalForm layout={'horizontal'} modalProps={{ centered: true }} form={form} width={500} title={'修改订单信息'}
               visible={visible} labelCol={{ span: 7 }}
               onVisibleChange={onVisibleChange}
               onFinish={onSubmit}>
      <ProFormDateTimePicker
        width='sm'
        name='appointTime'
        label='上门时间'
        placeholder='请选择上门时间'
        fieldProps={{ minuteStep: 30, format: 'YYYY-MM-DD HH:mm' }}
        rules={[{ required: true, message: '不能为空' }]}
      />
      <ProFormText
        width='sm'
        name='contract'
        label='联系人'
        placeholder='请输入联系人'
        rules={[{ required: true, message: '不能为空' }]}
      />
      <ProFormText
        width='sm'
        name='mobile'
        label='联系方式'
        placeholder='请输入联系方式'
        rules={[{ required: true, message: '不能为空' }]}
      />
      <ProForm.Item label='地址'>
        <ProFormText
          width='sm'
          name='location'
          placeholder='请输入地址'
          readonly
          rules={[{ required: true, message: '不能为空' }]}
          noStyle
        />
        <ProFormDependency name={['location']}>
          {({ location }) => {
            return <ProForm.Item name={'geo'} noStyle>
              <ChooseLocation location={location} changeLocation={(e) => {
                form.setFieldsValue({location:e});
              }
              } />
            </ProForm.Item>;
          }}
        </ProFormDependency>
      </ProForm.Item>
      <ProFormText
        width='sm'
        name='detailAddress'
        label='门牌号'
        placeholder='请输入地址'
        rules={[{ required: true, message: '不能为空' }]}
      />
    </ModalForm>
  );
};

EditAddressForm.propTypes = {
  id: PropTypes.string,
  order: PropTypes.object,
  visible: PropTypes.bool.isRequired,
  onFinish: PropTypes.func.isRequired,
  onVisibleChange: PropTypes.func.isRequired,
}
;
export default EditAddressForm;
