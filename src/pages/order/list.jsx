import React, { useRef, useState } from 'react';
import { Button, message, Popconfirm, Space, Tag } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import { history } from 'umi';
import OrderApi from '@/services/order/order';
import Enums from '@/utils/enums';
import ServiceItem from '@/components/ServiceItem';


const stateTabs = [
  {
    tab: '全部',
    key: 'all',
  },
  ...Object.values(Enums.orderState).map(({ text, value }) => ({ tab: text, key: value })),
];


const OrderList = props => {

  const tableRef = useRef();
  const [activeKey, setActiveKey] = useState();


  const changeTab = key => {
    if (key === 'all') {
      setActiveKey(null);
    } else {
      setActiveKey(key);
    }
    tableRef?.current?.reloadAndRest();
  };

  const pageRequest = params => {
    const pageParams = params;
    if (activeKey) {
      pageParams.state = activeKey;
    }
    return OrderApi.page(pageParams);
  };

  const confirmOrder = async id => {
    const hide = message.loading('操作中');
    try {
      await OrderApi.confirm({ id });
      message.success('操作成功');
      tableRef?.current?.reload();
    } catch (e) {
      console.log(e);
    } finally {
      hide();
    }
  };
  const serviceOrder = async id => {
    const hide = message.loading('操作中');
    try {
      await OrderApi.service({ id });
      message.success('操作成功');
      tableRef?.current?.reload();
    } catch (e) {
      console.log(e);
    } finally {
      hide();
    }
  };
  const serviceFinish = async id => {
    const hide = message.loading('操作中');
    try {
      await OrderApi.serviceFinish({ id });
      message.success('操作成功');
      tableRef?.current?.reload();
    } catch (e) {
      console.log(e);
    } finally {
      hide();
    }
  };


  const columns = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      width: 270,
      render: (v, { orderType, platform }) => <Space size={'small'} >
        <span>{v}</span>

          {orderType !== Enums.orderType.NORMAL.value &&
          <Tag color={Enums.orderType[orderType]?.color}>{Enums.orderType[orderType]?.text}</Tag>}
      </Space>,
      copyable: true,
    },
    {
      title: '服务信息',
      dataIndex: 'service',
      width: 300,
      render: (_, { service,sku,num }) => <ServiceItem service={service} sku={sku} num={num} />,
    },
    {
      title: '地址',
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
      render: (_, { id, type,state,groupJoin }) => {
        const orderState = Enums.orderState[state];
        const orderType = Enums.orderType[type];
        let canConfirm = orderState === Enums.orderState.WAIT_CONFIRM;
        if (orderType === Enums.orderType.GROUP) {
          if (groupJoin?.groupRecord?.state === Enums.groupRecordState.PROCESSING.value) {
            canConfirm = false;
          }
        }
        return <Space direction={'vertical'} size={'small'}>
          <Button type={'link'} onClick={() => history.push(`/order/detail?id=${id}`)}>详情</Button>
          {canConfirm &&
          <Popconfirm title={'确认订单?'} onConfirm={() => confirmOrder(id)}>
            <Button type={'link'}>确认</Button>
          </Popconfirm>}
          {orderState === Enums.orderState.WAIT_SERVICE &&
          <Popconfirm title={'确认开始服务订单?'} onConfirm={() => serviceOrder(id)}>
            <Button type={'link'}>开始服务</Button>
          </Popconfirm>
          }
          {orderState === Enums.orderState.SERVICING &&
          <Popconfirm title={'确认完成服务?'} onConfirm={() => serviceFinish(id)}>
            <Button type={'link'}>完成服务</Button>
          </Popconfirm>
          }

        </Space>;
      },
    }];
  return (
    <PageContainer>
      <ProTable
        actionRef={tableRef} request={pageRequest} toolBarRender={() => [
        <Button
          type='primary'
          key='primary'
          onClick={() => history.push('/shop/service/add')}
        >
          <PlusOutlined /> 新建
        </Button>,
      ]}
        rowKey='id'
        columns={columns}
        expandable={{
          // expandedRowRender,
        }}
        scroll={{x:1300}}
        search={{
          collapseRender: false,
          collapsed: false,
        }}
        toolbar={{
          menu: {
            type: 'tab',
            items: stateTabs,
            onChange: changeTab,
          },
        }}
      />
    </PageContainer>
  );

};


export default OrderList;
