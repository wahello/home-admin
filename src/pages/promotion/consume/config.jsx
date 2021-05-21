import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import ProForm, { ProFormDigit, ProFormSwitch } from '@ant-design/pro-form';
import { Form, message, Spin } from 'antd';
import CouponSelect from '@/components/CouponSelect';
import ConfigApi from '@/services/config';
import { useRequest } from '@@/plugin-request/request';

const ConsumeConfig = props => {
  const [activeTab, setActiveTab] = useState('config');
  const [baseForm] = Form.useForm();
  const getRequest = useRequest(() => ConfigApi.get({ type: 'consume' }));

  useEffect(() => {
    if (getRequest.data) {
      const { config } = getRequest.data;
      baseForm.setFieldsValue(config);
    }
  }, [getRequest.data]);

  const onFinish = async values => {
    await ConfigApi.save({
      type: 'consume',
      config: values,
    });
    message.success('保存成功');
  };

  return (
    <PageContainer tabList={[{ tab: '奖励配置', key: 'config' }, { tab: '奖励记录', key: 'record' }]} tabActiveKey={activeTab}
                   onTabChange={setActiveTab}>
      {activeTab === 'config' ? <ProCard>
        <Spin spinning={getRequest.loading}>
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
                     submitButtonProps: {
                       size: 'large',
                     },
                   }}>
            <ProFormSwitch
              name='enable'
              width={'md'}
              label='是否开启'
            />
            <ProForm.Item label={'奖励积分比例'} extra={'按照实际付款额计算，例如一次服务实际收款100元，奖励10%，则赠送10积分'} required>
              <ProFormDigit
                name='integral_percent'
                width={'xs'}
                initialValue={0}
                min={0}
                max={100}
                fieldProps={{ precision: 0 }}
                noStyle
              />
              <span> %</span>
            </ProForm.Item>
            <ProForm.Item label={'奖励余额比例'} extra={'按照实际付款额计算，例如一次服务实际收款100元，奖励10%，则赠送10元至客户余额'} required>
              <ProFormDigit
                name='balance_percent'
                width={'xs'}
                initialValue={0}
                min={0}
                max={100}
                fieldProps={{ precision: 0 }}
                noStyle
              />
              <span> %</span>
            </ProForm.Item>
            <CouponSelect
              width={'md'}
              name='coupons'
              label='赠送优惠券'
              placeholder='请选择'
              mode={'multiple'}
            />
          </ProForm>
        </Spin>
      </ProCard> : <></>}
    </PageContainer>
  );
};


export default ConsumeConfig;
