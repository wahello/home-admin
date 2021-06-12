import React, { useRef } from 'react';
import MemberApi from '@/services/member';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { Avatar, Button, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Enums from '@/utils/enums';
import { history } from 'umi';

const MemberManage = () => {
  const tableRef = useRef();

  const columns = [
    {
      dataIndex: 'nickname',
      title: '账户',
      render: (nickname, { avatar }) => {
        return <Space size={'small'}>
          {avatar ? <Avatar src={avatar} /> : <Avatar icon={<UserOutlined />} />}
          <span>{nickname}</span>
        </Space>;
      },
    },
    {
      dataIndex: 'mobile',
      title: '手机号',
    },
    {
      dataIndex: 'platform',
      title: '用户来源',
      render: it => {
        const platform = Enums.platform[it];
        return platform ? <Space size={'small'}>
          {platform.icon}
          <span>{platform.text}</span>
        </Space> : '-';
      },
    },
    {
      dataIndex: 'balance',
      title: '余额',
      valueType: 'money',
    },
    {
      dataIndex: 'integral',
      title: '积分',
    },
    {
      dataIndex: 'couponNum',
      title: '优惠券',
    },
    {
      dataIndex: 'orderNum',
      title: '订单数',
    },
    {
      dataIndex: 'paidFee',
      title: '消费金额',
      valueType: 'money'
    },
    {
      dataIndex: 'createTime',
      title: '注册时间',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      dataIndex: 'option',
      title: '操作',
      valueType: 'option',
      render: (_, { id }) => {
        return <Space>
          <Button type={'link'} onClick={() => history.push(`/member/detail?id=${id}`)}>详情</Button>
        </Space>;
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable
        size={'small'}
        actionRef={tableRef} request={MemberApi.page}
        rowKey='id'
        columns={columns}
      />
    </PageContainer>
  );
};


export default MemberManage;
