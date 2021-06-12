import React, { useRef } from 'react';
import { Button, message, Popconfirm, Space, Switch } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import CouponApi from '@/services/promotion/coupon';
import Enums from '@/utils/enums';
import { history } from 'umi';
import moment from 'moment';

const CouponList = () => {

  const tableRef = useRef();


  const removeRecord = async id => {
    const hide = message.loading('正在删除');
    try {
      await CouponApi.remove(id);
      message.success('删除成功');
      tableRef?.current?.reload();
    } catch (e) {
      console.error(e);
    } finally {
      hide();
    }
  };

  const columns = [
    {
      title: '优惠券名称',
      dataIndex: 'name',
    },
    {
      title: '优惠券类型',
      dataIndex: 'discountType',
      valueType: 'radio',
      valueEnum: Enums.discountType,
    },
    {
      title: '优惠金额/折扣',
      dataIndex: 'deduction',
      render: (_, record) => {
        return record.discountType === Enums.discountType.DEDUCTION.value ? `￥${record.deduction}` : `${record.rebate}折`;
      },
      hideInSearch: true,
    },
    {
      title: '使用门槛',
      dataIndex: 'useMin',
      valueType: 'money',
      hideInSearch: true,
    },
    {
      title: '有效期限',
      dataIndex: 'expireType',
      render: (it,{expireDate,expireDay}) => {
        return it === Enums.expireType.DATE.value ? `${moment(expireDate).format('YYYY-MM-DD')}前有效` : `领取后${expireDay}天有效`;
      },
      hideInSearch: true,
    },
    {
      title: '发放量',
      dataIndex: 'num',
      valueType: 'number',
      hideInSearch: true,
    },
    {
      title: '已发放数量',
      dataIndex: 'receiveCount',
      hideInSearch: true,
    },
    {
      title: '是否公开',
      dataIndex: 'isPublic',
      render: it => <Switch checked={it} />,
      valueType: 'radio',
      valueEnum: {
        true:{
          text: '是',
          value: true,
        },
        false:{
          text: '否',
          value: false,
        }

      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, { id }) => (<Space>
        <Button type={'link'} onClick={() => history.push(`./edit?id=${id}`)}>修改</Button>
        <Popconfirm title={<span>确认删除?<br />删除不会影响用户已领取过的券</span>} onConfirm={() => removeRecord(id)}
                    okButtonProps={{ type: 'primary', danger: true }}>
          <Button type={'link'} danger>删除</Button>
        </Popconfirm>
      </Space>),
    }];
  return <PageContainer>
    <ProTable
      actionRef={tableRef} request={CouponApi.page} toolBarRender={() => [
      <Button
        type='primary'
        key='primary'
        onClick={() => history.push('./add')}
      >
        <PlusOutlined /> 新建
      </Button>,
    ]}
      rowKey='id'
      columns={columns}
    />
  </PageContainer>;
};


export default CouponList;
