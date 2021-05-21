import React, { useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProForm, { ProFormDigit, ProFormText, ProFormTimePicker } from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import { Form, Spin,message } from 'antd';
import ShopAddress from '@/pages/shop/components/ShopAddress';
import ConfigApi from '@/services/config';
import { useRequest } from 'umi';
import moment from 'moment';

const ShopConfig = () => {

  const [baseForm] = Form.useForm();
  const getRequest = useRequest(()=>ConfigApi.get({type:'global'}))

  useEffect(()=>{
    if (getRequest.data) {
      const {config} = getRequest.data
      baseForm.setFieldsValue({
        ...config,
        appoint_time_range:[moment(config.appoint_time_range[0],'HH:mm:ss'),moment(config.appoint_time_range[1],'HH:mm:ss')]
      })
    }
  },[getRequest.data])

  const onFinish = async values => {
    await ConfigApi.save({
      type: 'global',
      config: values,
    });
    message.success('保存成功')
  };


  return (
    <PageContainer>
      <ProCard>
        <Spin spinning={getRequest.loading}>
          <ProForm form={baseForm} layout={'horizontal'} dateFormatter={'number'} labelCol={{ span: 8 }}
                   wrapperCol={{ span: 14 }}
                   hideRequiredMark
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
            <ProFormTimePicker.RangePicker name='appoint_time_range' label='可预约时间段'
                                           fieldProps={{ minuteStep: 30, format: 'HH:mm' }} />
            <ProForm.Item label={'默认分销比例'} extra={'用户如不单独设置分校比例，则会以最新的系统分销比例为准'}>
              <ProFormDigit
                name='rebate_rate'
                width={'xs'}
                initialValue={0}
                min={0}
                max={100}
                fieldProps={{ precision: 0 }}
                rules={[{ required: true }]}
                noStyle
              />
              <span> %</span>
            </ProForm.Item>
            <ProFormText label={'联系电话'} name={'contract'} width={'sm'} rules={[{ required: true }]} />
            <ProForm.Item name={'address'} label={'店铺地址'}>
              <ShopAddress />
            </ProForm.Item>
          </ProForm>
        </Spin>
      </ProCard>
    </PageContainer>
  );
};

ShopConfig.propTypes = {};

export default ShopConfig;
