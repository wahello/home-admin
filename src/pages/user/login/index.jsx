import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { message, Tabs } from 'antd';
import React, { useState } from 'react';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { history, Link, useModel } from 'umi';
import Footer from '@/components/Footer';
import styles from './index.less';
import AccountApi from '@/services/account';


const goto = () => {
  if (!history) return;
  setTimeout(() => {
    const { query } = history.location;
    const { redirect } = query;
    history.push(redirect || '/');
  }, 50);
};



const Login = () => {
  const [submitting, setSubmitting] = useState(false);
  const { initialState, setInitialState } = useModel('@@initialState');

  const [type,setType] = useState('password')


  const fetchInitInfo = async () => {
    const initInfo = await initialState?.initInfo?.();
    if (initInfo) {
      setInitialState({ ...initialState, ...initInfo });
    }
  };


  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      // 登录
      const res = await AccountApi.login({
        ...values,
      });
      message.success('登录成功！');
      localStorage.setItem('token', res.data);
      await fetchInitInfo();
      goto();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to='/'>
              <img alt='logo' className={styles.logo} src={'/logo.svg'} />
              <span className={styles.title}>优速到家</span>
            </Link>
          </div>
        </div>
        <div className={styles.main}>
          <ProForm
            submitter={{
              searchConfig: {
                submitText: '登录',
              },
              render: (_, dom) => dom.pop(),
              submitButtonProps: {
                loading: submitting,
                size: 'large',
                block: true,
              },
            }}
            onFinish={handleSubmit}
          >
            <Tabs activeKey={type} onChange={setType}>
              <Tabs.TabPane
                key="password"
                tab={'密码登录'}
              />
              <Tabs.TabPane
                key="mobile"
                tab={'验证码登录'}
              />
            </Tabs>
            <ProFormText
              name='mobile'
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={styles.prefixIcon} />,
              }}
              placeholder='手机号'
              rules={[
                {
                  required: true,
                  message: '手机号是必填项！',
                },
              ]}
            />
            <ProFormText.Password
              name='password'
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={styles.prefixIcon} />,
              }}
              placeholder='密码'
              rules={[
                {
                  required: true,
                  message: '密码是必填项！',
                },
              ]}
            />
          </ProForm>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
