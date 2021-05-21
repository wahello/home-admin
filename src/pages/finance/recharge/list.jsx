import React from 'react';
import RechargeApi from '@/services/promotion/recharge';
import ProTable from '@ant-design/pro-table';
import Enums from '@/utils/enums';
import { Avatar, Space, Tag } from 'antd';

const recordColumns = [
  {
    title: '充值用户',
    dataIndex: 'userInfo',
    formItemProps: {
      name: 'user',
    },
    align: 'center',
    render: userInfo => {
      return <Space>
        <Avatar src={userInfo.avatar} />
        <Space direction={'vertical'}>
          <b>{userInfo.nickname}</b>
          <span>{userInfo.mobile}</span>
        </Space>
      </Space>;
    },
  },
  {
    title: '充值单号',
    dataIndex: 'recharge_no',
    width: 200,
    align: 'center',
  },
  {
    title: '付款渠道',
    dataIndex: 'channel',
    align: 'center',
    valueType: 'select',
    valueEnum: Enums.payChannel,
    render: (_, entity) => {
      const payChannel = Enums.payChannel[entity.channel];
      return payChannel ? <Space size={'small'}>
        {payChannel.icon}
        <span>{payChannel.text}</span>
      </Space> : '-';
    },
  },

  {
    title: '充值面额',
    dataIndex: 'money',
    align: 'center',
    valueType: 'money',
    hideInSearch: true,
  },
  {
    title: '赠送余额',
    dataIndex: 'send_balance',
    align: 'center',
    valueType: 'money',
    hideInSearch: true,
  },
  {
    title: '赠送积分',
    dataIndex: 'send_integral',
    align: 'center',
    hideInSearch: true,
  },
  {
    title: '赠送优惠券',
    dataIndex: 'send_coupons',
    width: 200,
    align: 'center',
    hideInSearch: true,
    render: it => {
      return it.length ?
        <Space direction={'vertical'}>{it.map(coupon => <Tag color={'blue'}>{coupon.name}</Tag>)}</Space> : '-';
    },
  },
  {
    title: '充值状态',
    dataIndex: 'state',
    width: 200,
    align: 'center',
    valueEnum: Enums.payState,
  },
  {
    title: '充值时间',
    dataIndex: '_add_time_str',
    align: 'center',
    hideInSearch: true,
  },
];

const RechargeList = () => {
  return (
    <ProTable
      search={{
        collapseRender:false
      }}
      size={'small'}
      request={RechargeApi.pageRecord}
      rowKey='_id'
      columns={recordColumns}
    />
  );
};


export default RechargeList;
