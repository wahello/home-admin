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
  const dataSource = joins
  return <ProCard>
    <ProTable size={'small'}
              columns={[
                { 
                  title: '会员信息',
                  dataIndex: 'nickname',
                  render: (_,{ avatar, nickname, mobile,isVirtual, isMaster }) => {
                    if (isVirtual) {
                      return <Space size={'small'}><Avatar /><span>虚拟用户</span></Space>;
                    }
                    return <Space size={'small'}><Avatar src={avatar} /><Space size={'small'}
                                                                               direction={'vertical'}><b>{nickname} {isMaster &&
                    <Tag color={'blue'}>团主</Tag>}</b><span>{mobile}</span></Space></Space>;
                  },
                },
                {
                  title: '服务规格',
                  dataIndex: 'orderSku',
                  render: (_,{orderSku}) => {
                    if (orderSku) {
                      return <Space size={'small'}>
                        <Image src={orderSku.pic} width={50} height={50} preview={{ mask: false }} />
                        <Space size={'small'} direction={'vertical'}>
                          <span>名称：{orderSku.name}</span>
                          <span>数量：{orderSku.num}</span>
                        </Space>
                      </Space>;
                    }
                    return '-';
                  },
                },
                {
                  title: '订单金额',
                  dataIndex: 'orderFee',
                  valueType: 'money',
                },
                {
                  title: '订单状态',
                  dataIndex: 'orderState',
                  valueEnum: Enums.orderState,
                },
                {
                  title: '操作',
                  dataIndex: 'option',
                  valueType: 'option',
                  render: (_, { orderId }) => {
                    return <Space size={'small'}>
                      <Button type={'link'} disabled={!orderId}
                              onClick={() => history.push(`/order/detail?id=${orderId}`)}>查看订单</Button>
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
      dataIndex: 'groupName',
      title: '拼团名称',
    },
    {
      dataIndex: 'service',
      title: '拼团商品',
      render: service => {
        return <Space><Image src={service.mainPic} width={50} height={50}
                             preview={{ mask: false }} /><span>{service.name}</span></Space>;
      },
    },
    {
      dataIndex: 'joinMin',
      title: '成团人数/当前人数',
      render: (_, { joinMin, joinNum }) => `${joinMin}/${joinNum}`,
      hideInSearch: true,
    },
    {
      dataIndex: 'createTime',
      title: '开团时间',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      dataIndex: 'endTime',
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
      render: (_, { id }) => (<Space>
        <Button type={'link'} icon={expandRowKey === id ? <UpOutlined /> : <DownOutlined />}
                onClick={() => setExpandRowKey(expandRowKey ? null : id)}>查看参团人员</Button>
      </Space>),
    },
  ];

  return <ProTable
    size={'small'}
    actionRef={tableRef} request={GroupApi.pageRecord} toolBarRender={() => []}
    rowKey='id'
    expandable={{
      expandedRowRender,
      expandedRowKeys: expandRowKey ? [expandRowKey] : null,
      expandIcon: () => null,
    }}
    columns={columns}
  />;
};


export default RecordTable;
