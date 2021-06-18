import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import { Button, Form, message, Result, Spin } from 'antd';
import ProForm, { ProFormDigit } from '@ant-design/pro-form';
import { useRequest } from '@@/plugin-request/request';
import { history } from '@@/core/history';
import RechargeApi from '@/services/promotion/recharge';
import CouponSelect from '@/components/CouponSelect';


const RechargeForm = props => {
  const [id] = useState(props.location.query.id);
  const [baseForm] = Form.useForm();


  const getRequest = useRequest(RechargeApi.get, { manual: true });

  useEffect(() => {
    if (id) {
      getRequest.run({ id });
    }
  }, [id]);
  useEffect(() => {
    if (getRequest.data) {
      baseForm.setFieldsValue(getRequest.data);
    }
  }, [getRequest.data]);

  const onFinish = async values => {
    try {
      const submitValues = {
        ...values,
      };
      if (id) {
        await RechargeApi.update({ id, recharge: submitValues });
      } else {
        await RechargeApi.add({ recharge: submitValues });
      }
      message.success('保存成功');
      history.goBack();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  return (
    <PageContainer>
      <Spin spinning={getRequest.loading}>
        <ProCard>
          {getRequest.error ?
            <Result status={500} title={'加载错误'} subTitle={'网络异常，请重试'}
                    extra={<Button type={'primary'} onClick={() => getRequest.run({ id })}>重试</Button>} /> :
            <ProForm form={baseForm} layout={'horizontal'} dateFormatter={'number'} labelCol={{ span: 8 }}
                     wrapperCol={{ span: 14 }}
                     onFinish={onFinish}
                     validateMessages={{
                       required: '此项为必填项',
                     }}
                     submitter={{
                       searchConfig: {
                         submitText: '保存',
                       },
                       render: (_, dom) => <div style={{ textAlign: 'center' }}>{dom.pop()}</div>,
                     }}>
              <ProFormDigit
                name='money'
                width={'md'}
                label='充值金额'
                placeholder='请输入充值金额'
                fieldProps={{ precision: 2 }}
                rules={[{ required: true }]}
              />
              <ProFormDigit
                name='integral'
                width={'md'}
                label='赠送积分'
                placeholder='请输入赠送积分'
                fieldProps={{ precision: 0 }}
              />
              <ProFormDigit
                name='balance'
                width={'md'}
                label='赠送余额'
                placeholder='请输入赠送余额'
                fieldProps={{ precision: 0 }}
              />
              <CouponSelect
                width={'md'}
                name='coupons'
                label='赠送优惠券'
                placeholder='请选择'
                mode={'multiple'}
              />
            </ProForm>}
        </ProCard>
      </Spin>
    </PageContainer>
  );
};


export default RechargeForm;
