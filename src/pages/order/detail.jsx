// @refresh reset
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Col, Form, message, Modal, Result, Row, Skeleton, Space, Tag } from 'antd';
import ProCard from '@ant-design/pro-card';
import { useRequest } from '@@/plugin-request/request';
import OrderApi from '@/services/order/order';
import Enums from '@/utils/enums';

import ProTable, { EditableProTable } from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';

import uuid from 'uuid';
import { ModalForm, ProFormDigit, ProFormField } from '@ant-design/pro-form';
import { useBoolean } from 'ahooks';
import CancelOrderForm from '@/pages/order/components/CancelOrderForm';

const payRecordColumns = [{
  dataIndex: 'payNo',
  title: '支付流水号',
  copyable: true,
  width: 250,
}, {
  dataIndex: 'channel',
  title: '支付渠道',
  width: 250,
  render: (_, entity) => {
    return <Space size={'small'}>
      {Enums.payChannel[entity.channel].icon}
      <span>{Enums.payChannel[entity.channel].text}</span>
    </Space>;
  },
}, {
  dataIndex: 'createTime',
  title: '支付时间',
  valueType: 'dateTime',
  width: 250,
}, {
  dataIndex: 'fee',
  title: '支付金额',
  valueType: 'money',
  width: 200,
}, {
  dataIndex: ['handle_user', 'username'],
  title: '操作员',
  align: 'center',
  width: 150,
}, {
  dataIndex: 'remark',
  title: '操作备注',
  align: 'center',
  width: 250,
}, {
  dataIndex: 'state',
  title: '支付状态',
  valueEnum: Enums.payState,
}];
const refundRecordColumns = [{
  dataIndex: 'refundNo',
  title: '退款流水号',
  copyable: true,
  width: '20%',
},
  {
    dataIndex: 'createTime',
    valueType: 'dateTime',
    title: '退款时间',
    width: '20%',
  }, {
    dataIndex: 'fee',
    title: '退款金额',
    valueType: 'money',
    width: '10%',
  }, {
    dataIndex: 'type',
    title: '退款方式',
    valueEnum: Enums.refundType,
    width: '10%',
  }, {
    dataIndex: 'method',
    title: '退款路径',
    valueEnum: Enums.refundMethod,
    width: '10%',
  }, {
    dataIndex: ['handle_user', 'username'],
    title: '操作员',
    align: 'center',
    width: '15%',
  }, {
    dataIndex: 'state',
    title: '退款状态',
    width: '15%',
    valueEnum: Enums.refundState,
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
  const { data: order, loading, error, refresh } = useRequest(() => OrderApi.get(id));
  const actionRef = useRef();
  const [adjustItemForm] = Form.useForm();

  const [editableKeys, setEditableRowKeys] = useState([]);
  const [adjustItems, setAdjustItems] = useState([]);

  const [payOfflineVisible, togglePayOfflineVisible] = useBoolean(false);
  const [cancelVisible, toggleCancelVisible] = useBoolean(false);

  useEffect(() => {
    if (order) {
      const dbAdjustItems = order.adjustItems || [];
      setAdjustItems(dbAdjustItems);
      const orderState = Enums.orderState[order.state];
      if ([Enums.orderState.SERVICING, Enums.orderState.WAIT_PAY_AFTER].includes(orderState)) {
        setEditableRowKeys(dbAdjustItems.map(it => it.id));
      }
    }
  }, [order]);

  const infoColumns = [
    {
      dataIndex: ['service', 'name'],
      title: '服务名称',
      editable: false,
    },
    {
      dataIndex: ['sku', 'name'],
      title: '服务规格',
      editable: false,
    },
    {
      dataIndex: 'num',
      title: '数量',
      editable: false,
    },
    {
      dataIndex: 'platform',
      title: '订单来源',
      editable: false,
      render: (_, entity) => {
        return <Space size={'small'}>
          {Enums.platform[entity.platform].icon}
          <span>{Enums.platform[entity.platform].text}</span>
        </Space>;
      },
    }, {
      dataIndex: 'createTime',
      title: '下单时间',
      valueType: 'dateTime',
      editable: false,
    }, {
      dataIndex: 'appointTime',
      title: '预约时间',
      valueType: 'dateTime',
      editable: false,
    }, {
      dataIndex: ['address', 'contract'],
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
      dataIndex: 'shopRemark',
      title: '订单备注',

      span: 3,
    }];


  const onUpdateOrder = async (key, values) => {
    const { address, shopRemark } = values;
    await OrderApi.updateAddress({
      id,
      address,
      shopRemark,
    });
    refresh();
  };

  const confirmService = () => {
    Modal.confirm({
      content: '确认订单?',
      okText: '确认',
      centered: true,
      onOk: async () => {
        await OrderApi.confirm({ id });
        refresh();
        return true;
      },
    });
  };
  const startService = () => {
    Modal.confirm({
      content: '确认开始服务订单?',
      okText: '确认',
      centered: true,
      onOk: async () => {
        await OrderApi.service({ id });
        refresh();
        return true;
      },
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
      content: '确认添加额外服务项?',
      okText: '确认',
      centered: true,
      onOk: async () => {
        await OrderApi.saveAdjustItems({ id, adjustItems });
        refresh();
        return true;
      },
    });
  }, [adjustItemForm, adjustItems, id, refresh]);

  const payOffline = async ({ fee, remark }) => {
    await OrderApi.payOffline({ id, fee, remark });
    refresh();
    return true;
  };

  const openPayOffline = () => {
    if (order.actualFee - order.paidFee <= 0) {
      message.warning('订单已无待支付金额');
    } else {
      togglePayOfflineVisible.setTrue();
    }
  };

  const closeOrder = () => {
    const payType = Enums.payType[order.service.pay.type];
    if (payType !== Enums.payType.AFTER) {
      toggleCancelVisible.setTrue();
      return;
    }
    Modal.confirm({
      title: '取消订单提示',
      content: '请确保与客户沟通好取消，以免造成客户的误解以及不必要的纠纷',
      okText: '确认取消',
      okType: 'primary',
      okButtonProps: { danger: true },
      centered: true,
      onOk: async () => {
        await OrderApi.cancelOrder({ id });
        refresh();
        return true;
      },
    });
  };

  const renderExtra = useMemo(() => {
    if (order) {
      const orderState = Enums.orderState[order.state];
      const orderType = Enums.orderType[order.orderType];
      let canConfirm = orderState === Enums.orderState.WAIT_CONFIRM;
      let canClose = [Enums.orderState.WAIT_PAY, Enums.orderState.WAIT_PAY_PART, Enums.orderState.WAIT_CONFIRM, Enums.orderState.WAIT_SERVICE, Enums.orderState.SERVICING, Enums.orderState.CLOSING].includes(orderState);
      if (orderType === Enums.orderType.GROUP) {
        if (order.groupJoin?.groupRecord?.state === Enums.groupRecordState.PROCESSING.value) {
          canConfirm = false;
          canClose = false;
        }
      }
      const canService = orderState === Enums.orderState.WAIT_SERVICE;
      const canServiceEnd = orderState === Enums.orderState.SERVICING;
      const canPayOffline = orderState === Enums.orderState.WAIT_PAY_AFTER;
      return <Space>
        {canConfirm && <Button type={'primary'} onClick={confirmService}>确认订单</Button>}
        {canService && <Button type={'primary'} onClick={startService}>开始服务订单</Button>}
        {canServiceEnd && <Button type={'primary'} onClick={serviceFinish}>完成服务</Button>}
        {canPayOffline && <Button type={'primary'} onClick={openPayOffline}>线下支付</Button>}
        {canClose && <Button type={'primary'} onClick={closeOrder} danger>取消订单</Button>}
      </Space>;
    }
    return null;
  }, [order]);
  const renderAdjustItemExtra = useMemo(() => {
    const orderState = Enums.orderState[order?.state];
    if ([Enums.orderState.SERVICING].includes(orderState)) {
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

  return <PageContainer extra={renderExtra} fixedHeader>
    {
      error ? <ProCard>
        <Result status={404} title={'订单不存在'} extra={<Button onClick={window.close}>关闭</Button>} />
      </ProCard> : loading ? <>
          <ProCard><Skeleton /></ProCard><br /><ProCard><Skeleton /></ProCard><br /><ProCard><Skeleton /></ProCard></> :
        <>
          <ProCard
            title={<Space><span>单号: {order.orderNo}</span>{order.orderType !== Enums.orderType.NORMAL.value && <Tag
              color={Enums.orderType[order.orderType]?.color}>{Enums.orderType[order.orderType]?.text}</Tag>}</Space>}
            extra={
              <span style={{ fontSize: 20, fontWeight: 'bold' }}>
              {Enums.orderState[order.state].text}
                {order.groupJoin?.groupRecord?.state && <span
                  style={{ color: Enums.groupRecordState[order.groupJoin.groupRecord.state].color }}>({Enums.groupRecordState[order.groupJoin.groupRecord.state].text})</span>}
            </span>
            }>
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
                  <ProDescriptions.Item valueType={'money'} label={'订单原价'}>{order.totalFee}</ProDescriptions.Item>
                  <ProDescriptions.Item valueType={'money'} label={'优惠金额'}>{order.couponFee}</ProDescriptions.Item>
                  <ProDescriptions.Item valueType={'money'} label={'附加款项'}>{order.adjustFee}</ProDescriptions.Item>
                  <ProDescriptions.Item valueType={'money'} label={'实际金额'}>{order.actualFee}</ProDescriptions.Item>
                  <ProDescriptions.Item valueType={'money'} label={'已付金额'}>{order.paidFee}</ProDescriptions.Item>
                </ProDescriptions>
              </Col>
            </Row>
          </ProCard>

          <br />
          <ProCard title={'支付记录'} subTitle={'(由于支付平台到账通知有延时,用户支付成功的订单状态更新可能会出现稍许延迟)'}>
            <ProTable cardProps={{ bodyStyle: { padding: 0 } }} search={false} rowKey={'_id'} toolbar={false}
                      scroll={{ y: 300 }}
                      options={false} pagination={false}
                      dataSource={order?.pay_records}
                      columns={payRecordColumns} />
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

          <ProCard title={'退款记录'} >
            <ProTable cardProps={{ bodyStyle: { padding: 0 } }} search={false} rowKey={'_id'} toolbar={false}
                      options={false} pagination={false}
                      dataSource={order?.refund_records}
                      columns={refundRecordColumns} />
          </ProCard>
          <ModalForm width={400} title={'线下支付'} layout={'horizontal'} labelCol={{ span: 6 }}
                     modalProps={{ centered: true }}
                     visible={payOfflineVisible}
                     onVisibleChange={togglePayOfflineVisible.toggle} onFinish={payOffline}
                     initialValues={{ fee: Number(order.actual_fee - order.paid_fee).toFixed(2) }}>
            <ProFormDigit
              width='200'
              max={order.actual_fee - order.paid_fee}
              name='fee'
              label='付款金额'
              placeholder='请输入'
              rules={[{ required: true, message: '不能为空' }]}
            />
            <ProFormField
              width='200'
              name='remark'
              label='付款备注'
              placeholder='请输入'
            />
          </ModalForm>
          <CancelOrderForm visible={cancelVisible} onFinish={() => {
            refresh();
            return true;
          }
          } onVisibleChange={toggleCancelVisible.toggle} order={order} />
        </>
    }
  </PageContainer>;

};


export default OrderDetail;
