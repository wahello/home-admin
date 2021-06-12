import React from 'react';
import RechargeApi from '@/services/promotion/recharge';
import ProTable from '@ant-design/pro-table';
import Enums from '@/utils/enums';
import { Avatar, Space, Tag } from 'antd';

const recordColumns = [
  {
    title: '充值用户',
    dataIndex: 'nickname',
    formItemProps: {
      name: 'user',
    },
    align: 'center',
    render: (_,{nickname,avatar,mobile}) => {
      return <Space>
        <Avatar src={avatar} />
        <Space direction={'vertical'}>
          <b>{nickname}</b>
          <span>{mobile}</span>
        </Space>
      </Space>;
    },
  },
  {
    title: '充值单号',
    dataIndex: 'rechargeNo',
    width: 200,
    align: 'center',
  },
  {
    title: '付款渠道',
    dataIndex: 'channel',
    align: 'center',
    valueType: 'select',
    valueEnum: Enums.payChannel,
    hideInSearch: true,
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
    dataIndex: 'sendBalance',
    align: 'center',
    valueType: 'money',
    hideInSearch: true,
  },
  {
    title: '赠送积分',
    dataIndex: 'sendIntegral',
    align: 'center',
    hideInSearch: true,
  },
  {
    title: '赠送优惠券',
    dataIndex: 'sendCoupons',
    width: 200,
    align: 'center',
    hideInSearch: true,
    render: (_,{sendCouponNames}) => {
      return sendCouponNames ?
        <Space direction={'vertical'}>{sendCouponNames.map(name => <Tag color={'blue'}>{name}</Tag>)}</Space> : '-';
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
    dataIndex: 'createTime',
    valueType: 'dateTime',
    align: 'center',
    hideInSearch: true,
  },
];

const RechargeList = () => {
  return (
    <ProTable
      search={{
        collapseRender: false,
        defaultCollapsed: false,
      }}
      size={'small'}
      request={RechargeApi.pageRecord}
      rowKey='id'
      columns={recordColumns}
    />
  );
};


export default RechargeList;
