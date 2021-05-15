import React, { useRef, useState } from 'react';
import ProTable from '@ant-design/pro-table';
import GroupApi from '@/services/promotion/group';
import { Avatar, Button, Image, Space, Tag } from 'antd';
import Enums from '@/utils/enums';
import ProCard from '@ant-design/pro-card';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { history } from 'umi';


const expandedRowRender = row => {
  const { joins } = row;
  const dataSource = joins.map((join) => {
    return {
      ...join,
      sku: join.order.service?.sku,
    };
  });
  return <ProCard>
    <ProTable size={'small'}
              columns={[
                {
                  title: '用户信息',
                  dataIndex: 'userInfo',
                  render: ({ avatar, nickname, mobile }, { is_virtual, is_master }) => {
                    if (is_virtual) {
                      return <Space size={'small'}><Avatar /><span>虚拟用户</span></Space>;
                    }
                    return <Space size={'small'}><Avatar src={avatar} /><Space size={'small'}
                                                                               direction={'vertical'}><b>{nickname} {is_master &&
                    <Tag color={'blue'}>团主</Tag>}</b><span>{mobile}</span></Space></Space>;
                  },
                },
                {
                  title: '服务规格',
                  dataIndex: 'sku',
                  render: (sku) => {
                    if (sku) {
                      return <Space size={'small'}>
                        <Image src={sku.pic} width={50} height={50} preview={{ mask: false }} />
                        <Space size={'small'} direction={'vertical'}>
                          <span>名称：{sku.name}</span>
                          <span>数量：{sku.num}</span>
                        </Space>
                      </Space>;
                    }
                    return '-';
                  },
                },
                {
                  title: '订单金额',
                  dataIndex: ['order', 'actual_fee'],
                  valueType: 'money',
                },
                {
                  title: '订单状态',
                  dataIndex: ['order', 'state'],
                  valueEnum: Enums.orderState,
                },
                {
                  title: '操作',
                  dataIndex: 'option',
                  valueType: 'option',
                  render: (_, { order }) => {
                    return <Space size={'small'}>
                      <Button type={'link'} disabled={!order._id}
                              onClick={() => history.push(`/order/detail?id=${order._id}`)}>查看订单</Button>
                    </Space>;
                  },
                },
              ]}
              headerTitle={false}
              search={false}
              options={false}
              dataSource={dataSource}
              pagination={false}
    /></ProCard>;
};


const RecordTable = () => {
  const tableRef = useRef();
  const [expandRowKey, setExpandRowKey] = useState(null);

  const columns = [
    {
      dataIndex: ['group', 'name'],
      title: '拼团名称',
    },
    {
      dataIndex: ['group', 'service'],
      title: '拼团商品',
      render: service => {
        return <Space><Image src={service.main_pic} width={50} height={50}
                             preview={{ mask: false }} /><span>{service.name}</span></Space>;
      },
    },
    {
      dataIndex: '_add_time',
      title: '开团时间',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      dataIndex: 'join_min',
      title: '成团人数/当前人数',
      render: (_, { join_min, join_num }) => `${join_min}/${join_num}`,
      hideInSearch: true,
    },
    {
      dataIndex: 'end_time',
      title: '结束时间',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      dataIndex: 'state',
      title: '拼团状态',
      valueEnum: Enums.groupRecordState,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, { _id }) => (<Space>
        <Button type={'link'} icon={expandRowKey === _id ? <UpOutlined /> : <DownOutlined />}
                onClick={() => setExpandRowKey(expandRowKey ? null : _id)}>查看参团人员</Button>
      </Space>),
    },
  ];

  return <ProTable
    size={'small'}
    actionRef={tableRef} request={GroupApi.pageRecord} toolBarRender={() => []}
    rowKey='_id'
    expandable={{
      expandedRowRender,
      expandedRowKeys: expandRowKey ? [expandRowKey] : null,
      expandIcon: () => null,
    }}
    columns={columns}
  />;
};


export default RecordTable;
