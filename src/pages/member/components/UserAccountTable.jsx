import React, { useImperativeHandle, useRef } from 'react';
import PropTypes from 'prop-types';
import Enums from '@/utils/enums';
import ProTable from '@ant-design/pro-table';
import MemberApi from '@/services/member';

const UserAccountTable = React.forwardRef(({ userId },ref) => {
  const tableRef = useRef();

  useImperativeHandle(ref, () => ({
    reset: tableRef?.current.reset,
  }));

  const pageRequest = params => {
    return MemberApi.pageAccount({
      ...params,
      userId,
    });
  };

  const columns = [
    {
      title: '类型',
      dataIndex: 'type',
      valueEnum: Enums.accountType,
    },
    {
      title: '发生方式',
      dataIndex: 'action',
      valueEnum: Enums.accountAction,
    },
    {
      title: '数据金额',
      dataIndex: 'value',
      hideInSearch: true,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      hideInSearch: true,
    },
    {
      title: '发生时间',
      dataIndex: '_add_time_str',
      hideInSearch: true,
      width: 150,
    },
  ];

  return <ProTable
    size={'small'}
    actionRef={tableRef} request={pageRequest} toolBarRender={() => []}
    rowKey='_id'
    pagination={{ pageSize: 10 }}
    columns={columns}
  />;


});

UserAccountTable.propTypes = {
  userId: PropTypes.string,
};

export default UserAccountTable;
