import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ProTable from '@ant-design/pro-table';
import { Button, Space, Tag } from 'antd';
import MemberApi from '@/services/member';
import { useBoolean } from 'ahooks';
import EditUserAddress from '@/pages/member/components/EditUserAddress';

const UserAddressTable = ({ memberId }) => {
  const tableRef = useRef();
  const pageRequest = params => {
    return MemberApi.pageAddress(memberId,params);
  };
  const [editVisible, toggleEditVisible] = useBoolean(false);
  const [editAddress, setEditAddress] = useState();

  const columns = [
    {
      dataIndex: 'name',
      title: '联系人',
    },
    {
      dataIndex: 'mobile',
      title: '联系方式',
    },
    {
      dataIndex: 'location',
      title: '地址',
      render: (location, { defaultFlag }) => {
        return <Space>
          <span>{location}</span>
          {defaultFlag && <Tag color={'blue'}>默认地址</Tag>}
        </Space>;
      },
    },
    {
      dataIndex: 'detailAddress',
      title: '门牌号',
    },
    {
      dataIndex: 'option',
      valueType: 'option',
      title: '操作',
      render: (_, address) => {
       return <Space>
          <Button type={'link'} onClick={() => {
            setEditAddress(address);
            toggleEditVisible.setTrue();
          }
          }>修改地址</Button>
        </Space>;
      },
    },
  ];

  return <>
    <ProTable
      size={'small'}
      actionRef={tableRef} request={pageRequest}
      rowKey='id'
      pagination={{ pageSize: 10 }}
      columns={columns}
      search={false}
    />
    <EditUserAddress address={editAddress} onFinish={() => {
      tableRef?.current.reload();
      return true;
    }} onVisibleChange={toggleEditVisible.toggle} visible={editVisible} />
  </>;
};

UserAddressTable.propTypes = {
  memberId: PropTypes.string,
};

export default UserAddressTable;
