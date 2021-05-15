import React, { useRef } from 'react';
import { Button, Space, Tag } from 'antd';
import ProTable from '@ant-design/pro-table';
import OrderApi from '@/services/order/order';
import { history } from 'umi';
import PropTypes from 'prop-types';
import Enums from '@/utils/enums';
import ServiceItem from '@/components/ServiceItem';

const UserOrderTable = ({ userId }) => {

  const tableRef = useRef();

  const pageRequest = params => {
    return OrderApi.page({
      ...params,
      userId,
    });
  };


  const columns = [
    {
      title: '订单号',
      dataIndex: 'order_no',
      width: 220,
      render: (v, { type }) => <Space direction={'vertical'}>
        <span>{v}</span>
        <Tag color={Enums.orderType[type]?.color}>{Enums.orderType[type]?.text}</Tag>
      </Space>,
      copyable: true,
    },
    {
      title: '服务信息',
      dataIndex: 'service',
      width: 300,
      render: (it) => <ServiceItem service={it} />,
      hideInSearch: true,
    },
    {
      title: '地址',
      dataIndex: 'address',
      width: 300,
      render: (it) => <div>
        <Space size={'small'} direction={'vertical'}>
          <Space>
            <span>{it.name}</span>
            <span>{it.mobile}</span>
          </Space>
          <span>{it.location}</span>
        </Space>
      </div>,
      hideInSearch: true,
    },
    {
      title: '预约时间',
      dataIndex: 'appoint_time',
      hideInSearch: true,
      width: 150,
    },
    {
      title: '支付模式',
      dataIndex: ['service', 'pay', 'type'],
      valueEnum: Enums.payType,
      width: 150,
    },
    {
      title: '实付金额',
      dataIndex: 'actual_fee',
      width: 150,
      valueType: 'money',
    },
    {
      title: '已支付金额',
      dataIndex: 'paid_fee',
      width: 150,
      valueType: 'money',
    },
    {
      title: '状态',
      dataIndex: 'state',
      valueEnum: Enums.orderState,
      hideInSearch: true,
      width: 150,
      align: 'center',
    },
    {
      title: '下单时间',
      dataIndex: '_add_time_str',
      width: 150,
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, { _id }) => (<Space>
        <Button type={'link'}
                onClick={() => history.push(`/order/detail?id=${_id}`)}>查看详情</Button>
      </Space>),
    },
  ];

  return <ProTable
    size={'small'}
    actionRef={tableRef} request={pageRequest} toolBarRender={() => []}
    rowKey='_id'
    pagination={{pageSize:10}}
    columns={columns}
  />;

};
UserOrderTable.propTypes = {
  userId: PropTypes.string,
};

export default UserOrderTable;
