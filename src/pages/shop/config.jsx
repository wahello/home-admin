import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import { Form, Menu, message, Spin } from 'antd';
import ShopAddress from '@/pages/shop/components/ShopAddress';
import ConfigApi from '@/services/config';
import { useRequest } from 'umi';
import moment from 'moment';

const ShopConfig = () => {

  const [baseForm] = Form.useForm();
  const getRequest = useRequest(() => ConfigApi.get({ type: 'global' }));
  const [currentKey, setCurrentKey] = useState('base');

  useEffect(() => {
    if (getRequest.data) {
      const { config } = getRequest.data;
      baseForm.setFieldsValue({
        ...config,
        appoint_time_range: [moment(config.appoint_time_range[0], 'HH:mm:ss'), moment(config.appoint_time_range[1], 'HH:mm:ss')],
      });
    }
  }, [getRequest.data]);

  const onFinish = async values => {
    await ConfigApi.save({
      type: 'global',
      config: values,
    });
    message.success('保存成功');
  };


  return (
    <PageContainer>
      <ProCard >
        <ProCard ghost colSpan='200px' >
          <Menu
            style={{ width: 200, height: 600, overflowX: 'hidden', overflowY: 'auto', borderRight: 'none' }}
            selectedKeys={[currentKey]}
            onSelect={({ key }) => setCurrentKey(key)}
            mode='inline'
          >
            <Menu.Item key='base'>基础信息</Menu.Item>
            <Menu.Item key='auth'>认证信息</Menu.Item>
            <Menu.Item key='desc'>店铺简介</Menu.Item>
          </Menu>
        </ProCard>
        <ProCard ghost style={{marginLeft:50}}>
          <Spin spinning={getRequest.loading}>
            <ProForm form={baseForm} layout={'vertical'} dateFormatter={'number'}
                     hideRequiredMark
                     onFinish={onFinish}
                     validateMessages={{
                       required: '此项为必填项',
                     }}
                     submitter={{
                       searchConfig: {
                         submitText: '保存信息',
                       },
                       render: (_, dom) => dom.pop(),
                     }}>

              <ProFormText label={'客服电话'} name={'contract'} width={'sm'} rules={[{ required: true }]} />
              <ProForm.Item name={'address'} label={'店铺地址'}>
                <ShopAddress />
              </ProForm.Item>
            </ProForm>
          </Spin>
        </ProCard>
      </ProCard>

    </PageContainer>
  );
};

ShopConfig.propTypes = {};

export default ShopConfig;
