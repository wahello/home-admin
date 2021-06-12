import React, { useRef } from 'react';
import { Button, Popconfirm, Space, Tag } from 'antd';
import ProTable from '@ant-design/pro-table';
import { history } from 'umi';
import PropTypes from 'prop-types';
import Enums from '@/utils/enums';
import ServiceItem from '@/components/ServiceItem';
import MemberApi from '@/services/member';

const UserOrderTable = ({ memberId }) => {

  const tableRef = useRef();

  const pageRequest = params => {
    return MemberApi.pageOrder(memberId, params);
  };


  const columns = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      width: 300,
      render: (v, { orderType, platform }) => <Space size={'small'}>
        <span>{v}</span>

        {orderType !== Enums.orderType.NORMAL.value &&
        <Tag color={Enums.orderType[orderType]?.color}>{Enums.orderType[orderType]?.text}</Tag>}
      </Space>,
      copyable: true,
    },
    {
      title: '服务信息',
      dataIndex: 'service',
      width: 250,
      render: (_, { service, sku, num }) => <ServiceItem service={service} sku={sku} num={num} />,
    },
    {
      title: '上门地址',
      dataIndex: 'address',
      width: 300,
      render: (it) => <div>
        <Space size={'small'} direction={'vertical'}>
          <Space>
            <span>{it.contract}</span>
            <span>{it.mobile}</span>
          </Space>
          <span>{it.location}</span>
        </Space>
      </div>,
      hideInSearch: true,
    },
    {
      title: '上门时间',
      dataIndex: 'appointTime',
      width: 150,
      valueType: 'dateTime',
    },
    {
      title: '支付模式',
      dataIndex: 'payType',
      valueEnum: Enums.payType,
      width: 100,
    },
    {
      title: '实付金额',
      dataIndex: 'actualFee',
      valueType: 'money',
      hideInSearch: true,
      width: 100,
    },
    {
      title: '已付金额',
      dataIndex: 'paidFee',
      valueType: 'money',
      hideInSearch: true,
      width: 100,
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
      dataIndex: 'createTime',
      valueType: 'dateTime',
      width: 150,
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      align: 'center',
      render: (_, {
        id,
      }) => {
        return <Button type={'link'} onClick={() => history.push(`/order/detail?id=${id}`)}>详情</Button>;
      },
    }];

  return <ProTable
    size={'small'}
    actionRef={tableRef} request={pageRequest} toolBarRender={() => []}
    rowKey='id'
    pagination={{ pageSize: 10 }}
    columns={columns}
  />;

};
UserOrderTable.propTypes = {
  memberId: PropTypes.string,
};

export default UserOrderTable;
