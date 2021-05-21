import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import ProForm, { ProFormDigit, ProFormSwitch } from '@ant-design/pro-form';
import { Form, message, Spin } from 'antd';
import { useRequest } from '@@/plugin-request/request';
import ConfigApi from '@/services/config';
import CouponSelect from '@/components/CouponSelect';

const RegisterConfig = props => {
  const [activeTab, setActiveTab] = useState('config');
  const [baseForm] = Form.useForm();
  const getRequest = useRequest(() => ConfigApi.get({ type: 'register' }));

  useEffect(() => {
    if (getRequest.data) {
      const { config } = getRequest.data;
      baseForm.setFieldsValue(config);
    }
  }, [getRequest.data]);

  const onFinish = async values => {
    await ConfigApi.save({
      type: 'register',
      config: values,
    });
    message.success('保存成功');
  };

  return (
    <PageContainer tabList={[{ tab: '奖励配置', key: 'config' }, { tab: '奖励记录', key: 'record' }]} tabActiveKey={activeTab}
                   onTabChange={setActiveTab}>
      <ProCard>
        <Spin spinning={getRequest.loading}><ProForm form={baseForm} layout={'horizontal'} dateFormatter={'number'} labelCol={{ span: 8 }}
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
          <ProFormDigit
            name='integral'
            width={'xs'}
            initialValue={0}
            min={0}
            max={100}
            fieldProps={{ precision: 0 }}
            rules={[{ required: true }]}
            label={'赠送积分'}
            extra={'0为不赠送'}
          />
          <ProForm.Item label={'赠送余额'} extra={'0为不赠送'} required>
            <ProFormDigit
              name='balance'
              width={'xs'}
              initialValue={0}
              min={0}
              max={100}
              fieldProps={{ precision: 0 }}
              rules={[{ required: true }]}
              noStyle
            />
            <span> 元</span>
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
      </ProCard>
    </PageContainer>
  );
};


export default RegisterConfig;
