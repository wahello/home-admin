import React, { useRef } from 'react';
import { Avatar, Button, message, Popconfirm, Space, Tag } from 'antd';
import { history } from '@@/core/history';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import RechargeApi from '@/services/promotion/recharge';
import ProCard from '@ant-design/pro-card';
import Enums from '@/utils/enums';



const RechargeList = props => {

  const configTabRef = useRef();

  const removeRecord = async id => {
    await RechargeApi.remove({ id });
    message.success('删除成功');
    configTabRef?.current?.reload();
  };

  const changeState = async (id, enable) => {
    const hide = message.loading(enable ? '开启中' : '关闭中');
    try {
      await RechargeApi.changeState({ id, enable });
      message.success(`${enable ? '开启' : '关闭'}成功`);
      configTabRef?.current?.reload();
    } catch (e) {
      console.error(e);
    } finally {
      hide();
    }
  };

  const columns = [
    {
      title: '充值面额',
      dataIndex: 'money',
      align: 'center',
      valueType: 'money',
    },
    {
      title: '赠送余额',
      dataIndex: 'balance',
      width: 200,
      align: 'center',
      valueType: 'money',
    },
    {
      title: '赠送积分',
      dataIndex: 'integral',
      width: 200,
      align: 'center',
    },
    {
      title: '赠送优惠券',
      dataIndex: 'coupons',
      width: 200,
      align: 'center',
      render: it => {
        return it.length ?
          <Space direction={'vertical'}>{it.map(coupon => <Tag color={'blue'}>{coupon.name}</Tag>)}</Space> : '-';
      },
    },
    {
      title: '充值次数',
      dataIndex: 'recharge_num',
      align: 'center',
    },
    {
      title: '是否开启',
      dataIndex: 'enable',
      valueType: 'radioButton',
      align: 'center',
      valueEnum: {
        true: { text: '已开启', status: 'Processing' },
        false: { text: '已关闭', status: 'Error' },
      },
    },
    {
      title: '创建时间',
      dataIndex: '_add_time_str',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      align: 'center',
      render: (_, { _id, enable }) => (<Space>
        <Button type={'link'} onClick={() => history.push(`./edit?id=${_id}`)}>修改</Button>
        <Button type={'link'} onClick={() => changeState(_id, !enable)}>{enable ? '关闭' : '开启'}</Button>
        <Popconfirm title={'确认删除?'} onConfirm={() => removeRecord(_id)}
                    okButtonProps={{ type: 'primary', danger: true }}>
          <Button type={'link'} danger>删除</Button>
        </Popconfirm>
      </Space>),
    }];
  return <PageContainer>
    <ProTable
      size={'small'}
      actionRef={configTabRef} request={RechargeApi.page} search={false} toolBarRender={() => [
      <Button
        type='primary'
        key='primary'
        onClick={() => history.push('./add')}
      >
        <PlusOutlined /> 新建
      </Button>,
    ]}
      rowKey='_id'
      columns={columns}
    />
  </PageContainer>;
};


export default RechargeList;
