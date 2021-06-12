import React, { useCallback } from 'react';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Menu, Space, Spin } from 'antd';
import { history, useModel } from 'umi';
import { stringify } from 'querystring';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import moment from 'moment';


/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
  localStorage.removeItem('token');
  const { query = {}, pathname } = history.location;
  const { redirect } = query;
  if (window.location.pathname !== '/user/login' && !redirect) {
    history.replace({
      pathname: '/user/login',
      search: stringify({
        redirect: pathname,
      }),
    });
  }
};

const AvatarDropdown = ({ menu }) => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const onMenuClick = useCallback(
    (event) => {
      const { key } = event;
      if (key === 'logout' && initialState) {
        setInitialState({ ...initialState, userInfo: undefined });
        loginOut();
        return;
      }
      history.push(`/account/${key}`);
    },
    [initialState, setInitialState],
  );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size='small'
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { userInfo } = initialState;

  if (!userInfo || !userInfo.mobile) {
    return loading;
  }
  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item key='center'>
        <UserOutlined />
        个人中心
      </Menu.Item>
      <Menu.Item key='settings'>
        <SettingOutlined />
        个人设置
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key='logout'>
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
              <span className={`${styles.action} ${styles.account}`}>
      <Space size={'small'}>
        <span>有效期: {userInfo.expireDate ? moment(userInfo.expireDate).format('YYYY-MM-DD') : '永久'}</span>
        <span>{userInfo.brand}</span>
      </Space>
                   </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
