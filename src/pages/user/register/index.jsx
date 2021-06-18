import React from 'react';
import ProForm, { ProFormCaptcha, ProFormText } from '@ant-design/pro-form';
import AccountApi from '@/services/account';
import ProCard from '@ant-design/pro-card';
import { LockOutlined, MobileOutlined } from '@ant-design/icons';
import { message } from 'antd';

const Register = props => {

  const register = async values => {
    await AccountApi.register(values);
  };
  return (
    <ProCard>
      <ProForm layout={'horizontal'} labelCol={{ span: 6 }}
               wrapperCol={{ span: 18 }}
               onFinish={register}
               submitter={{
                 searchConfig: {
                   submitText: '立即注册',
                 },
                 render: (_, dom) => <div style={{ textAlign: 'center' }}>{dom.pop()}</div>,
               }}
               size={'large'}
      >
        <ProFormText label={'店铺名称'} name={'brand'} rules={[{ required: true, message: '请输入店铺名称' }]}
                     placeholder={'请输入店铺名称'}
                     fieldProps={{ maxLength: 10 }} />
        <ProFormText label={'您的称呼'} name={'realName'} rules={[{ required: true, message: '请输入您的称呼' }]}
                     placeholder={'请输入您的称呼'}
                     fieldProps={{ maxLength: 10 }} />
        <ProFormText
          fieldProps={{
            prefix: <MobileOutlined />,
          }}
          label={'手机号'}
          name='mobile'
          placeholder={'请输入手机号'}
          rules={[
            {
              required: true,
              message: '请输入手机号！',
            },
            {
              pattern: /^1\d{10}$/,
              message: '手机号格式错误！',
            },
          ]}
        />
        <ProFormCaptcha
          label={'验证码'}
          fieldProps={{
            prefix: <LockOutlined />,
            maxLength: 6,
          }}
          placeholder={'请输入验证码'}
          name='verifyCode'
          rules={[
            {
              required: true,
              message: '请输入验证码！',
            },
          ]}
          phoneName={'mobile'}
          onGetCaptcha={async (mobile) => {
            await AccountApi.registerCode({
              mobile,
            });
            message.success('发送验证码成功');
            return true
          }}
        />
        <ProFormText.Password label='密码' name='password' />
      </ProForm>
    </ProCard>
  );
};


export default Register;
