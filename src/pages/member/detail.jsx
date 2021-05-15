import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest } from '@@/plugin-request/request';
import MemberApi from '@/services/member';
import ProDescriptions from '@ant-design/pro-descriptions';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Enums from '@/utils/enums';
import UserOrderTable from '@/pages/member/components/UserOrderTable';
import UserCouponTable from '@/pages/member/components/UserCouponTable';
import UserFavoriteTable from '@/pages/member/components/UserFavoriteTable';
import UserAddressTable from '@/pages/member/components/UserAddressTable';


const MemberDetail = props => {
  const memberColumns = [
    {
      dataIndex: 'avatar',
      title: '头像',
      render: avatar => avatar ? <Avatar size={'large'} src={avatar} /> :
        <Avatar size={'large'} icon={<UserOutlined />} />,
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
      dataIndex: 'real_name',
      title: '真实姓名',
    },
    {
      dataIndex: 'gender',
      title: '性别',
    },
    {
      dataIndex: 'platform',
      title: '注册平台',
      render: it => {
        return Enums.platform[it]?.icon || '-';
      },
    },
    {
      dataIndex: 'register_date',
      title: '注册时间',
      valueType: 'dateTime',
    },
    {
      dataIndex: 'last_login_date',
      title: '最后登录时间',
      valueType: 'dateTime',
    },
    {
      dataIndex: 'remark',
      title: '用户备注',
      span: 4,
    },
    {
      dataIndex: 'tags',
      title: '用户标签',
      span: 4,
    },
  ];
  const { id } = props.location.query;
  const { data: member, loading, error, refresh } = useRequest(() => MemberApi.get({ userId: id }));
  const [activeKey, setActiveKey] = useState('order');

  const actionRef = useRef();
  return (
    <PageContainer
      content={
        <ProDescriptions
          column={4}
          actionRef={actionRef}
          dataSource={member}
          columns={memberColumns}
        />
      }
      tabList={[
        {
          tab: '订单',
          key: 'order',
        },
        {
          tab: '余额',
          key: 'balance',
        },
        {
          tab: '积分',
          key: 'integral',
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
      {activeKey === 'order' && <UserOrderTable userId={id} />}
      {activeKey === 'balance' && <UserOrderTable userId={id} />}
      {activeKey === 'integral' && <UserOrderTable userId={id} />}
      {activeKey === 'coupon' && <UserCouponTable userId={id} />}
      {activeKey === 'favorite' && <UserFavoriteTable userId={id} />}
      {activeKey === 'address' && <UserAddressTable userId={id} />}
    </PageContainer>
  );
};


export default MemberDetail;
