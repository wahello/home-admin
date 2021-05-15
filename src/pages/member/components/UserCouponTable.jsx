import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, Space } from 'antd';
import Enums from '@/utils/enums';
import ProTable from '@ant-design/pro-table';
import MemberApi from '@/services/member';
import moment from 'moment';
import SendCoupon from '@/pages/member/components/SendCoupon';
import { useBoolean } from 'ahooks';


const columns = [

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
    title: '使用门槛',
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
    title: '领取时间',
    dataIndex: '_add_time_str',
    hideInSearch: true,
  },

];
const UserCouponTable = ({ userId }) => {
  const tableRef = useRef();

  const pageRequest = params => {
    return MemberApi.pageCoupon({
      ...params,
      userId,
    });
  };

  const [sendCouponVisible, toggleSendCouponVisible] = useBoolean(false);

  return <>
    <ProTable
      size={'small'}
      actionRef={tableRef} request={pageRequest}
      rowKey='_id'
      pagination={{ pageSize: 10 }}
      toolBarRender={() => [
        <Button
          type='primary'
          key='primary'
          onClick={toggleSendCouponVisible.setTrue}>
          发放优惠券
        </Button>,
      ]}
      columns={columns}
    />
    <SendCoupon userId={userId} onFinish={() => {
      tableRef?.current.reload();
      return true;
    }} onVisibleChange={toggleSendCouponVisible.toggle} visible={sendCouponVisible} />
  </>;
};

UserCouponTable.propTypes = {
  userId: PropTypes.string,
};

export default UserCouponTable;
