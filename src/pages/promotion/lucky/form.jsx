import React, { useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import { Button, Form, message, Result, Spin } from 'antd';
import ProForm, { ProFormDateRangePicker, ProFormDigit, ProFormText } from '@ant-design/pro-form';
import { useRequest } from '@@/plugin-request/request';
import { history } from '@@/core/history';
import LuckyApi from '@/services/promotion/lucky';
import MaterialPicker from '@/components/MaterialPicker';
import GiftTable from '@/pages/promotion/lucky/components/GiftTable';


const LuckyForm = props => {
  const [id] = useState(props.location.query.id);
  const [baseForm] = Form.useForm();



  const getRequest = useRequest(LuckyApi.get, { manual: true });

  useEffect(() => {
    if (id) {
      getRequest.run({ id });
    }
  }, [id]);
  useEffect(() => {
    if (getRequest.data) {
      baseForm.setFieldsValue({
        ...getRequest.data,
        effectiveTime:[getRequest.data.start_time,getRequest.data.end_time]
      });
    }
  }, [getRequest.data]);

  const onFinish = async values => {
    try {
      const submitValues = {
        ...values,
        coupons: values.coupons?.map(it => it._id),
      };
      if (id) {
        await LuckyApi.update({ id, lucky: submitValues });
      } else {
        await LuckyApi.add({ lucky: submitValues });
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
                       submitButtonProps: {
                         size: 'large',
                       },
                     }}>
              <ProFormText
                name='name'
                width={'md'}
                label='抽奖名称'
                placeholder='请输入抽奖名称'
                rules={[{ required: true }]}
              />
              <ProFormDateRangePicker
                transform={(values) => {
                  return {
                    start_time: values ? values[0] : undefined,
                    end_time: values ? values[1] : undefined,
                  };
                }}
                width='md'
                name='effectiveTime'
                label='有效时间'
                rules={[{ required: true }]}
              />
              <ProForm.Item label={'消耗积分'} extra={'每次抽奖需要消耗的积分，为0则代表不消耗积分'} required>
                <ProFormDigit
                  name='integral_cost'
                  width={'sm'}
                  fieldProps={{ precision: 0 }}
                  rules={[{ required: true }]}
                  noStyle
                />
                <span> 积分</span>
              </ProForm.Item>
              <ProForm.Item label={'每日参与次数'} extra={'每天最多可抽奖次数，为0则代表不限制，每日0点清零'} required>
                <ProFormDigit
                  name='period'
                  width={'xs'}
                  fieldProps={{ precision: 0 }}
                  rules={[{ required: true }]}
                  noStyle
                />
                <span> 次</span>
              </ProForm.Item>
              <ProForm.Item label={'整体中奖概率'} required>
                <ProFormDigit
                  name='probability'
                  width={'xs'}
                  fieldProps={{ precision: 0 }}
                  rules={[{ required: true }]}
                  noStyle
                />
                <span> %</span>
              </ProForm.Item>
              <ProFormText
                name='unwin_tip'
                width={'md'}
                label='未中奖提示语'
                placeholder='请输入未中奖提示语'
                initialValue={'很遗憾，未中奖'}
                rules={[{ required: true }]}
              />
              <ProForm.Item name={'unwin_pic'} label={'未中奖图片'} rules={[{ required: true }]}>
                <MaterialPicker />
              </ProForm.Item>
              <ProForm.Item
                label='奖品'
                name='gifts'
                initialValue={[]}
                rules={[{ min: 1, msg: '最少设置一个奖品', type: 'array' }]}
                extra={'最少设置1个奖品，最多设置7个奖品，其余将会由未中奖占位'}
              >
                <GiftTable />
              </ProForm.Item>
            </ProForm>}
        </ProCard>
      </Spin>
    </PageContainer>
  );
};


export default LuckyForm;
