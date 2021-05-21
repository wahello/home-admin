import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest } from '@@/plugin-request/request';
import MemberApi from '@/services/member';
import ProDescriptions from '@ant-design/pro-descriptions';
import { Avatar, Button, InputNumber, Space } from 'antd';
import { EditOutlined, UserOutlined } from '@ant-design/icons';
import Enums from '@/utils/enums';
import UserOrderTable from '@/pages/member/components/UserOrderTable';
import UserCouponTable from '@/pages/member/components/UserCouponTable';
import UserFavoriteTable from '@/pages/member/components/UserFavoriteTable';
import UserAddressTable from '@/pages/member/components/UserAddressTable';
import UserAccountTable from '@/pages/member/components/UserAccountTable';
import AdjustAccountForm from '@/pages/member/components/AdjustAccountForm';
import { useBoolean } from 'ahooks';
import { history } from 'umi';


const MemberDetail = props => {
  const { id } = props.location.query;
  const { data: member, loading, error, refresh } = useRequest(() => MemberApi.get({ userId: id }),);
  const [activeKey, setActiveKey] = useState('account');
  const [adjustVisible, toggleAdjustVisible] = useBoolean(false);
  const [adjustType, setAdjustType] = useState(Enums.accountType.BALANCE.value);

  const actionRef = useRef();
  const accountRef = useRef();

  const updateUser = async (key, values) => {
    await MemberApi.update({
      id,
      [key]: values[key],
    });
    refresh();
  };
  const adjustBalance = () => {
    setAdjustType(Enums.accountType.BALANCE.value);
    toggleAdjustVisible.setTrue();
  };
  const adjustIntegral = () => {
    setAdjustType(Enums.accountType.INTEGRAL.value);
    toggleAdjustVisible.setTrue();
  };
  const memberColumns = [
    {
      dataIndex: 'avatar',
      title: '头像',
      render: avatar => avatar ? <Avatar size={'large'} src={avatar} /> :
        <Avatar size={'large'} icon={<UserOutlined />} />,
      editable: false,
    },
    {
      dataIndex: 'nickname',
      title: '昵称',
    },
    {
      dataIndex: 'mobile',
      title: '手机号',
    },
    {
      dataIndex: ['invite_user','_id'],
      title: '上级用户',
      render: (it,{invite_user}) => {
        return it ?  <a onClick={() => window.open(`./detail?id=${it}`)}>{invite_user.nickname}</a>:'-'
      },
      editable: false
    },
    {
      dataIndex: 'gender',
      valueEnum: Enums.gender,
      title: '性别',
    },
    {
      dataIndex: 'platform',
      title: '注册平台',
      editable: false,
      render: it => {
        const platform = Enums.platform[it];
        return platform ? <Space size={'small'}>
          {platform.icon}
          <span>{platform.text}</span>
        </Space> : '-';
      },
    },
    {
      dataIndex: 'register_date',
      title: '注册时间',
      valueType: 'dateTime',
      editable: false,
    },
    {
      dataIndex: 'last_login_date',
      title: '最后登录时间',
      valueType: 'dateTime',
      editable: false,
    },
    {
      dataIndex: 'remark',
      title: '备注',
      span: 4,
    },
    {
      dataIndex: 'tags',
      title: '标签',
      editable: false,
      span: 4,
    },
    {
      dataIndex: 'balance',
      title: '用户余额',
      valueType: 'money',
      editable: false,
      render: v => <span>{`￥${v}`}<EditOutlined style={{ marginLeft: 5 }} onClick={adjustBalance} /></span>,
    },
    {
      dataIndex: 'integral',
      title: '用户积分',
      render: v => <span>{v} <EditOutlined style={{ marginLeft: 5 }} onClick={adjustIntegral} /></span>,
      editable: false,
    },
    {
      dataIndex: 'rebate_balance',
      title: '分销奖励',
      valueType: 'money',
    },
    {
      dataIndex: 'rebate_rate',
      title: '分销比例',
      valueType: 'integer',
      renderFormItem: () => <InputNumber min={0} max={100} precision={0} />,
      render: it => it ? `${it}%` : '系统默认',
    },
  ];

  console.log(accountRef);

  return (
    <>
      <PageContainer
        content={
          <>
            <ProDescriptions
              loading={loading}
              column={4}
              actionRef={actionRef}
              dataSource={member}
              columns={memberColumns}
              editable={{
                onSave: updateUser,
              }}
            />


          </>
        }
        tabList={[
          {
            tab: '账户明细',
            key: 'account',
          },
          {
            tab: '订单',
            key: 'order',
          },
          {
            tab: '优惠券',
            key: 'coupon',
          },
          {
            tab: '地址',
            key: 'address',
          },
          {
            tab: '收藏',
            key: 'favorite',
          },
        ]}
        tabActiveKey={activeKey}
        onTabChange={setActiveKey}
      >
        {activeKey === 'account' && <UserAccountTable userId={id} ref={accountRef} />}
        {activeKey === 'order' && <UserOrderTable userId={id} />}
        {activeKey === 'coupon' && <UserCouponTable userId={id} />}
        {activeKey === 'favorite' && <UserFavoriteTable userId={id} />}
        {activeKey === 'address' && <UserAddressTable userId={id} />}
      </PageContainer>
      <AdjustAccountForm onVisibleChange={toggleAdjustVisible.toggle} onFinish={() => {
        refresh();
        accountRef?.current.reset();
        return true;
      }} visible={adjustVisible} user={member}
                         type={adjustType} />
    </>
  );
};


export default MemberDetail;
