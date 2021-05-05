// @refresh reset
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Col, Form, Modal, Result, Row, Skeleton, Space } from 'antd';
import ProCard from '@ant-design/pro-card';
import { useRequest } from '@@/plugin-request/request';
import OrderApi from '@/services/order/order';
import Enums from '@/utils/enums';

import ProTable, { EditableProTable } from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';

import uuid from 'uuid';
import { ModalForm, ProFormDigit } from '@ant-design/pro-form';
import { useBoolean } from 'ahooks';
import { ReloadOutlined } from '@ant-design/icons';

const payRecordColumns = [{
  dataIndex: 'pay_no',
  title: '支付流水号',
  copyable: true,
  width: '20%',
}, {
  dataIndex: 'platform',
  title: '支付渠道',
  width: '20%',
  render: (_, entity) => {
    return <Space size={'small'}>
      {Enums.platform[entity.platform].icon}
      <span>{Enums.platform[entity.platform].text}</span>
    </Space>;
  },
}, {
  dataIndex: '_add_time_str',
  title: '支付时间',
  width: '20%',
}, {
  dataIndex: 'fee',
  title: '支付金额',
  valueType: 'money',
  width: '10%',
}, {
  dataIndex: ['handle_user', 'username'],
  title: '操作员',
  align: 'center',
  width: '15%',
}, {
  dataIndex: 'state',
  title: '支付状态',
  width: '15%',
  valueEnum: Enums.payState,
}];

const adjustColumns = [{
  dataIndex: 'name',
  title: '收费项目名称',
  align: 'center',
  formItemProps: {
    rules: [{ required: true, message: '不能为空' }],
  },
}, {
  dataIndex: 'fee',
  title: '金额',
  valueType: 'money',
  align: 'center',
  formItemProps: {
    rules: [{ required: true, message: '不能为空' }],
  },
}, {
  dataIndex: 'remark',
  title: '备注',
  align: 'center',
}, {
  title: '操作',
  valueType: 'option',
  align: 'center',
  render: () => {
    return null;
  },
}];


const OrderDetail = props => {

  const { id } = props.location.query;
  const { data: order, loading, error, refresh } = useRequest(() => OrderApi.get({ id }));
  const actionRef = useRef();
  const [adjustItemForm] = Form.useForm();

  const [editableKeys, setEditableRowKeys] = useState([]);
  const [adjustItems, setAdjustItems] = useState([]);

  const [payOfflineVisible, togglePayOfflineVisible] = useBoolean(false);

  useEffect(() => {
    if (order) {
      const dbAdjustItems = order.adjust_items || [];
      setAdjustItems(dbAdjustItems);
      const orderState = Enums.orderState[order.state]
      if ([Enums.orderState.SERVICING, Enums.orderState.WAIT_PAY_AFTER].includes(orderState)) {
        setEditableRowKeys(dbAdjustItems.map(it => it.id));
      }
    }
  }, [order]);

  const infoColumns = [{
    dataIndex: 'platform',
    title: '订单渠道',
    editable: false,
    render: (_, entity) => {
      return <Space size={'small'}>
        {Enums.platform[entity.platform].icon}
        <span>{Enums.platform[entity.platform].text}</span>
      </Space>;
    },
  }, {
    dataIndex: '_add_time_str',
    title: '下单时间',
    editable: false,
  }, {
    dataIndex: 'appoint_time',
    title: '预约时间',
    editable: false,
  }, {
    dataIndex: ['address', 'name'],
    title: '联系人',
    formItemProps: {
      rules: [{ required: true, message: '不能为空' }],
    },
  }, {
    dataIndex: ['address', 'mobile'],
    title: '联系方式',
    formItemProps: {
      rules: [{ required: true, message: '不能为空' }],
    },

  }, {
    dataIndex: ['address', 'location'],
    title: '联系地址',
    formItemProps: {
      rules: [{ required: true, message: '不能为空' }],
    },
  }, {
    dataIndex: 'remark',
    title: '客户备注',
    editable: false,
    span: 3,
  }, {
    dataIndex: 'shop_remark',
    title: '订单备注',

    span: 3,
  }];


  const onUpdateOrder = async (key, values) => {
    const { address, shop_remark } = values;
    await OrderApi.updateAddress({
      id,
      address,
      shop_remark,
    });
    refresh();
  };

  const confirmService = () => {
    Modal.confirm({
      content: '确认订单?',
      okText: '确认',
      centered: true,
    });
  };
  const serviceFinish = () => {
    Modal.confirm({
      content: '确认服务完成?',
      okText: '确认',
      centered: true,
      onOk: async () => {
        await OrderApi.serviceFinish({ id });
        refresh();
      },
    });
  };

  const addAdjustItem = useCallback(() => {
    const newId = uuid();
    setAdjustItems([...adjustItems, { id: newId }]);
    setEditableRowKeys([...editableKeys, newId]);
  }, [adjustItems, editableKeys]);

  const saveAdjustItems = useCallback(async () => {
    await adjustItemForm.validateFields();
    Modal.confirm({
      content: '确认订单?',
      okText: '确认',
      onOk: async () => {
        await OrderApi.saveAdjustItems({ id, adjustItems });
        refresh();
        return true;
      },
    });
  }, [adjustItemForm, adjustItems, id, refresh]);

  const payOffline = async ({ fee }) => {
    await OrderApi.payOffline({ id, fee });
    refresh();
    return true;
  };

  const renderExtra = useMemo(() => {
    if (order) {
      const orderState = Enums.orderState[order.state];
      const canConfirm = orderState === Enums.orderState.WAIT_CONFIRM;
      const canService = orderState === Enums.orderState.WAIT_SERVICE;
      const canServiceFinish = orderState === Enums.orderState.SERVICING;
      const canPayOffline = orderState === Enums.orderState.WAIT_PAY_AFTER;
      return <Space>
        {canConfirm && <Button type={'primary'} onClick={confirmService}>确认订单</Button>}
        {canService && <Button type={'primary'}>开始服务订单</Button>}
        {canServiceFinish && <Button type={'primary'} onClick={serviceFinish}>完成服务</Button>}
        {canPayOffline && <Button type={'primary'} onClick={togglePayOfflineVisible.setTrue}>线下支付</Button>}
        {canService && <Button>修改信息</Button>}
        <Button onClick={refresh} icon={<ReloadOutlined/>}>刷新</Button>
        <Button type={'primary'} danger>关闭订单</Button>
      </Space>;
    }
    return null;
  }, [order]);
  const renderAdjustItemExtra = useMemo(() => {
    const orderState = Enums.orderState[order?.state];
    if ([Enums.orderState.SERVICING, Enums.orderState.WAIT_PAY_AFTER].includes(orderState)) {
      return <Space>
        <Button
          type='primary'
          key='save'
          onClick={addAdjustItem}
        >添加</Button>
        <Button
          type='primary'
          key='save'
          onClick={saveAdjustItems}
        >保存</Button>
      </Space>;
    }
    return null;
  }, [addAdjustItem, order?.state, saveAdjustItems]);

  return <PageContainer extra={renderExtra}>
    {
      error ? <ProCard>
        <Result status={404} title={'订单不存在'} extra={<Button onClick={window.close}>关闭</Button>} />
      </ProCard> : loading ? <>
          <ProCard><Skeleton /></ProCard><br /><ProCard><Skeleton /></ProCard><br /><ProCard><Skeleton /></ProCard></> :
        <>
          <ProCard title={`单号: ${order.order_no}`} extra={<span
            style={{ fontSize: 20, fontWeight: 'bold' }}>{Enums.orderState[order.state].text}</span>}>
            <Row>
              <Col span={18}>
                <ProDescriptions
                  actionRef={actionRef}
                  dataSource={order}
                  columns={infoColumns}
                  editable={{
                    onSave: onUpdateOrder,
                  }}
                />
              </Col>
              <Col span={3} offset={3}>
                <ProDescriptions column={1}>
                  <ProDescriptions.Item valueType={'money'} label={'订单原价'}>{order.service_fee}</ProDescriptions.Item>
                  <ProDescriptions.Item valueType={'money'} label={'优惠金额'}>{order.coupon_fee}</ProDescriptions.Item>
                  <ProDescriptions.Item valueType={'money'} label={'附加款项'}>{order.adjust_fee}</ProDescriptions.Item>
                  <ProDescriptions.Item valueType={'money'} label={'实际金额'}>{order.actual_fee}</ProDescriptions.Item>
                  <ProDescriptions.Item valueType={'money'} label={'已付金额'}>{order.paid_fee}</ProDescriptions.Item>
                </ProDescriptions>
              </Col>
            </Row>

            {/*<Descriptions.Item label='用户'>*/}
            {/*  <Space><Avatar src={order.buy_user.avatar} /> <span>{order.buy_user.nickname}</span></Space>*/}
            {/*</Descriptions.Item>*/}

          </ProCard>
          <br />
          <ProCard title={'额外收费项'} extra={renderAdjustItemExtra} bodyStyle={{ padding: '24px 0 ' }}>
            <EditableProTable
              rowKey='id'
              recordCreatorProps={false}
              columns={adjustColumns}
              value={adjustItems}
              onChange={setAdjustItems}
              editable={{
                form: adjustItemForm,
                type: 'multiple',
                editableKeys,
                actionRender: (row, config, defaultDom) => {
                  return [defaultDom.delete];
                },
                onValuesChange: (record, recordList) => {
                  setAdjustItems(recordList);
                },
                onChange: setEditableRowKeys,
              }}
            />
          </ProCard>
          <br />
          <ProCard title={'支付记录'}>
            <ProTable cardProps={{bodyStyle:{padding:0}}}  search={false} rowKey={'_id'} toolbar={false} options={false} pagination={false}
                      dataSource={order?.pay_records}
                      columns={payRecordColumns} />
          </ProCard>
          <ModalForm width={400} title={'线下支付'} layout={'horizontal'} labelCol={{ span: 10 }}
                     visible={payOfflineVisible}
                     onVisibleChange={togglePayOfflineVisible.toggle} onFinish={payOffline}
                     initialValues={{ fee: Number(order.actual_fee - order.paid_fee).toFixed(2) }}>
            <ProFormDigit
              width='200'
              max={order.actual_fee}
              name='fee'
              label='付款金额'
              placeholder='请输入'
              rules={[{ required: true, message: '不能为空' }]}
            />
          </ModalForm>
        </>
    }
  </PageContainer>;

};


export default OrderDetail;
