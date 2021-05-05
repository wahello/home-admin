import React, { useRef } from 'react';
import { Button, message, Popconfirm, Space } from 'antd';
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
      await CouponApi.remove({ id });
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
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
    },
    {
      title: '优惠券名称',
      dataIndex: 'name',
    },
    {
      title: '优惠券类型',
      dataIndex: ['discount', 'type'],
      valueType: 'radio',
      valueEnum: Enums.discountType,
    },
    {
      title: '优惠金额/折扣',
      dataIndex: ['discount', 'deduction'],
      render: (_, record) => {
        return record.discount.type === Enums.discountType.DEDUCTION.value ? `￥${record.discount.deduction}` : `${record.discount.rebate}折`;
      },
      hideInSearch: true,
    },
    {
      title: '最低使用金额',
      dataIndex: ['discount', 'use_min'],
      valueType: 'money',
      hideInSearch: true,
    },
    {
      title: '有效期限',
      dataIndex: 'expire',
      render: it => {
        return it.type === Enums.expireType.DATE.value ? `${moment(it.expire_date).format('YYYY-MM-DD')}前有效` : `领取后${it.expire_day}天有效`;
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
      dataIndex: 'receive_count',
      hideInSearch: true,
    },
    {
      title: '是否公开',
      dataIndex: 'is_public',
      valueType: 'switch',
      fieldProps:{
        width:'unset'
      }
    },
    {
      title: '创建时间',
      dataIndex: '_add_time_str',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, { _id }) => (<Space>
        <Button type={'link'} onClick={() => history.push(`./edit?id=${_id}`)}>修改</Button>
        <Popconfirm title={<span>确认删除?<br />删除不会影响用户已领取过的券</span>} onConfirm={() => removeRecord(_id)}
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
      rowKey='_id'
      columns={columns}
    />
  </PageContainer>;
};


export default CouponList;
