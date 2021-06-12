import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ProForm, { ModalForm, ProFormDependency, ProFormDigit, ProFormRadio, ProFormText } from '@ant-design/pro-form';
import { Form } from 'antd';
import Enums from '@/utils/enums';
import MaterialPicker from '@/components/MaterialPicker';
import CouponSelect from '@/components/CouponSelect';

const GiftForm = ({ gift, visible, onVisibleChange, onFinish }) => {

  const [form] = Form.useForm();
  useEffect(() => {
    if (gift) {
      form.setFieldsValue(gift);
    }
  }, [gift]);


  const onSubmit = async values => {
    if (gift) {
      onFinish({ ...gift,...values });
    } else {
      onFinish(values);
    }
    return true;
  };
  return (
    <ModalForm form={form} width={500} title={gift ? '修改奖品' : '添加奖品'} visible={visible} layout={'horizontal'}
               labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}
               onVisibleChange={onVisibleChange}
               onFinish={onSubmit}
               modalProps={{destroyOnClose:true}}
    >

      <ProFormText
        width='md'
        name='name'
        label='名称'
        placeholder='最多6个字'
        fieldProps={{ maxLength: 6 }}
        rules={[{ required: true }]}
      />
      {
        gift?.id !== 1 && <ProFormRadio.Group
          name='type'
          initialValue={Enums.giftType.COUPON.value}
          label='奖励类型'
          rules={[{ required: true }]}
          options={Object.values(Enums.giftType).filter(it => it.value !== 'NONE').map(({
                                                                                          text,
                                                                                          value,
                                                                                        }) => ({ label: text, value }))}
        />
      }
      <ProFormDependency name={['type']}>
        {
          ({ type }) => {
            switch (type) {
              case Enums.giftType.COUPON.value:
                return <CouponSelect
                  width={'md'}
                  name='coupon'
                  label='赠送优惠券'
                  placeholder='请选择'
                  rules={[{ required: true, message: '请选择优惠券' }]}
                />;
              case Enums.giftType.BALANCE.value:
                return <ProFormDigit name={'balance'} label={'面值'} width='xs' fieldProps={{ precision: 0 }}
                                     rules={[{ required: true, message: '请输入面值' }]} />;
              case Enums.giftType.INTEGRAL.value:
                return <ProFormDigit name={'integral'} label={'积分'} width='xs' fieldProps={{ precision: 0 }}
                                     rules={[{ required: true, message: '请输入积分' }]} />;
              default:
                return null;
            }
          }
        }
      </ProFormDependency>
      <ProForm.Item label={'奖品图片'} name={'pic'} rules={[{ required: true, message: '请选择奖品图片' }]}>
        <MaterialPicker />
      </ProForm.Item>
      <ProFormText
        width='md'
        name='tip'
        label='中奖提示'
        placeholder='请输入中奖提示'
        rules={[{ required: true }]}
      />
      <ProFormDigit
        fieldProps={{ precision: 0 }}
        width='xs'
        name='weight'
        label='奖项权重'
        initialValue={1}
        min={1}
        rules={[{ required: true, message: '请输入奖项权重' }]}
      />

    </ModalForm>
  );
};

GiftForm.propTypes = {
  gift: PropTypes.object,
  visible: PropTypes.bool.isRequired,
  onFinish: PropTypes.func.isRequired,
  onVisibleChange: PropTypes.func.isRequired,
};

export default GiftForm;
