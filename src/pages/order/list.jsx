import React, { useRef, useState } from 'react';
import { Button, Image, message, Popconfirm, Space } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import { history } from 'umi';
import OrderApi from '@/services/order/order';
import Enums from '@/utils/enums';
import styles from './index.less';


const stateTabs = [
  {
    label: '全部',
    key: 'all',
  },
  ...Object.values(Enums.orderState).map(({ text, value }) => ({ label: text, key: value })),
];


const Service = ({ service: { name, sku } }) => <div className={styles.service}>
  <Image width={60} height={60} src={sku.pic} />
  <div className={styles.info}>
    <div>
      <b>{name}</b>
      <b style={{ color: '#fa3534' }}>￥{sku.price}</b>
    </div>
    <div>
      <span>{sku.name}</span>
      <span>{sku.num}{sku.unit}</span>
    </div>
  </div>
</div>;

const OrderList = props => {

  const tableRef = useRef();
  const [activeKey, setActiveKey] = useState();

  const removeRecord = async id => {
    const hide = message.loading('正在删除');
    try {
      await OrderApi.remove({ id });
      message.success('删除成功');
      tableRef?.current?.reload();
    } catch (e) {
      console.error(e);
    } finally {
      hide();
    }
  };

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
      dataIndex: 'order_no',
      width: 220,
      copyable: true,
    },
    {
      title: '服务信息',
      dataIndex: 'service',
      width: 300,
      render: (it) => <Service service={it} />,
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
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'state',
      valueEnum: Enums.orderState,
      hideInSearch: true,
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
      align: 'center',
      render: (_, { _id, state }) => (<Space>
        <Button type={'link'} onClick={() => history.push(`/order/detail?id=${_id}`)}>详情</Button>
        {state === Enums.orderState.WAIT_CONFIRM.value &&
        <Popconfirm title={'确认订单?'} onConfirm={() => confirmOrder(_id)}>
          <Button type={'link'}>确认</Button>
        </Popconfirm>}
        {state === Enums.orderState.WAIT_SERVICE.value &&
        <Popconfirm title={'确认开始服务订单?'} onConfirm={() => serviceOrder(_id)}>
          <Button type={'link'}>开始服务</Button>
        </Popconfirm>
        }
        {state === Enums.orderState.SERVICING.value &&
        <Popconfirm title={'确认完成服务?'} onConfirm={() => serviceFinish(_id)}>
          <Button type={'link'}>完成服务</Button>
        </Popconfirm>
        }

      </Space>),
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
        rowKey='_id'
        columns={columns}
        expandable={{
          // expandedRowRender,
        }}
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
