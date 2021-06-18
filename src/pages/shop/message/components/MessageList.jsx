import React, { useMemo, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { Badge, Form, Space,message } from 'antd';
import { useRequest } from '@@/plugin-request/request';
import MessageApi from '@/services/message';
import { useBoolean } from 'ahooks';
import msgBusiness from '@/pages/shop/message/msgBusiness';
import Enums from '@/utils/enums';
import ProForm, { ModalForm, ProFormSwitch } from '@ant-design/pro-form';
import Field from '@ant-design/pro-field';

const MessageList = props => {

  const { data = [], loading } = useRequest(MessageApi.all);
  const [msgShow, toggleMsgShow] = useBoolean(false);
  const [msg, setMsg] = useState(null);
  const [form] = Form.useForm();

  const formatData = useMemo(() => {
    return msgBusiness.map(it => {
      return {
        ...it,
        actions: it.actions.map(action => {
          const msgs = data.filter(msgInfo => msgInfo.action === action.value).map(msgInfo=>({
            ...msgInfo,
            businessName: it.text,
            actionName: action.text,
            actionDesc: action.desc,
          }));
          return {
            ...action,
            msgs,
          };
        }),
      };
    });
  }, [data]);

  const showMsg = (platform,action) => {
    const msgInfo = action.msgs.find(it => it.platform === platform.value);
    if (msgInfo) {
      setMsg(msgInfo);
      form.setFieldsValue({
        ...msgInfo,
        platformName:platform.text
      });
      toggleMsgShow.setTrue();
    }else{
      message.error(`${action.text}${platform.text}通知未配置`);
    }

  };

  return <>
    <Space direction={'vertical'} style={{ width: '100%' }} size={'large'}>
      <ProCard>
        <Space direction={'vertical'}>
          <Badge status='warning' text='受平台限制,小程序通知每种业务类型只允许同时启用三个，短信通知不受限制' />
          <Badge status='warning' text='小程序通知需用户每次手动同意后才可成功发送，短信通知不受限制' />
          <Badge status='default' text={
            <span>短信通知格式默认为<b>平台签名+商户品牌+消息内容</b> 例如:<b
              style={{ color: '#0ea5e9' }}>【优速到家】XX家政 您预约的XX服务已被确认，点击链接查看详情</b></span>
          } />
          <Badge status='default' text={
            <span>设置短信签名后短信通知格式为 <b>商户短信签名+消息内容</b> 例如:<b
              style={{ color: '#0ea5e9' }}>【XX家政】您预约的XX服务已被确认，点击链接查看详情</b></span>
          } />
        </Space>
      </ProCard>
      {
        formatData.map(it => {
          return <ProCard key={it.value} title={<b>{it.text}</b>} subTitle={it.desc} gutter={[16, 16]} wrap
                          loading={loading}>
            {
              it.actions.map(action => {
                return <ProCard
                  key={action.value}
                  hoverable
                  bordered
                  title={<b>{action.text}</b>}
                  colSpan={{ xs: 24, sm: 12, md: 6, lg: 6, xl: 6 }}
                  actions={Object.values(Enums.msgPlatform).map(platform => <span onClick={() => showMsg(platform,action)}
                                                                            key={platform.value}>{React.cloneElement(platform.icon)}</span>)}
                >
                  <div>{action.desc}</div>
                </ProCard>;
              })
            }
          </ProCard>;
        })
      }
    </Space>
    <ModalForm form={form} title={'通知设置'} visible={msgShow} width={600} onVisibleChange={toggleMsgShow.toggle}
               modalProps={{ centered: true }} layout={'horizontal'}
               labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}
    >
      <ProForm.Item name={'actionName'} label={'通知节点'} valuePropName={'text'} style={{ marginBottom: 10 }}>
        <Field mode={'read'} />
      </ProForm.Item>
      <ProForm.Item name={'actionDesc'} label={'描述'} valuePropName={'text'} style={{ marginBottom: 10 }}>
        <Field mode={'read'} />
      </ProForm.Item>
      <ProForm.Item name={'content'} label={'通知示例'} valuePropName={'text'} style={{ marginBottom: 10 }}>
        <Field valueType={'code'} mode={'read'} />
      </ProForm.Item>
      <ProForm.Item name={'platformName'} label={'通知方式'} valuePropName={'text'} style={{ marginBottom: 10 }}>
        <Field mode={'read'} />
      </ProForm.Item>
      <ProFormSwitch name={'enableFlag'} label={'是否启用'} />
    </ModalForm>
  </>;
};


export default MessageList;
