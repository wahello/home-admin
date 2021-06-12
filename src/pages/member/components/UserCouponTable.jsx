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
    dataIndex: 'expireDate',
    render: it => {
      return `${moment(it.expire_date).format('YYYY-MM-DD')}前有效`;
    },
    hideInSearch: true,
  },
  {
    title: '领取时间',
    dataIndex: 'createTime',
    valueType: 'dateTime',
    hideInSearch: true,
  },

];
const UserCouponTable = ({ memberId }) => {
  const tableRef = useRef();

  const pageRequest = params => {
    return MemberApi.pageCoupon(memberId,params);
  };

  const [sendCouponVisible, toggleSendCouponVisible] = useBoolean(false);

  return <>
    <ProTable
      size={'small'}
      actionRef={tableRef} request={pageRequest}
      rowKey='id'
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
    <SendCoupon memberId={memberId} onFinish={() => {
      tableRef?.current.reload();
      return true;
    }} onVisibleChange={toggleSendCouponVisible.toggle} visible={sendCouponVisible} />
  </>;
};

UserCouponTable.propTypes = {
  memberId: PropTypes.string,
};

export default UserCouponTable;
