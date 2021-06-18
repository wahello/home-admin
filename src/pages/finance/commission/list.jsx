import React from 'react';
import ProTable from '@ant-design/pro-table';
import Enums from '@/utils/enums';
import CommissionApi from '@/services/finance/commission';
import { Avatar, Button, Space } from 'antd';

const recordColumns = [
  {
    title: '分销用户',
    dataIndex: 'avatar',
    align: 'center',
    formItemProps: {
      name: 'user',
    },
    render: (_, { avatar, nickname, mobile }) => {
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
    title: '关联订单',
    dataIndex: 'orderNo',
    width: 200,
    align: 'center',
  },
  {
    title: '订单金额',
    dataIndex: 'orderFee',
    width: 200,
    align: 'center',
    valueType: 'money',
    hideInSearch: true,
  },

  {
    title: '分销金',
    dataIndex: 'rebateFee',
    align: 'center',
    valueType: 'money',
    hideInSearch: true,
  },
  {
    title: '分销状态',
    dataIndex: 'state',
    align: 'center',
    valueEnum: Enums.rebateRecordState,
  },
  {
    title: '订单创建时间',
    dataIndex: 'createTime',
    align: 'center',
    hideInSearch: true,
  },
  {
    title: '操作',
    dataIndex: 'option',
    valueType: 'option',
    align: 'center',
    render: (_, record) => {
      return <Space size={'small'}>
        <Button type={'link'} target={'_blank'} href={`/member/detail?id=${record.memberId}`}>查看分销用户</Button>
        <Button type={'link'} target={'_blank'} href={`/order/detail?id=${record.orderId}`}>查看关联订单</Button>
      </Space>;
    },
  },
];

const CommissionList = () => {
  return (
    <ProTable
      size={'small'}
      request={CommissionApi.page}
      rowKey='_id'
      columns={recordColumns}
    />
  );
};


export default CommissionList;
