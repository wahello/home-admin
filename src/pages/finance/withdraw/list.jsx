import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import WithdrawApi from '@/services/finance/withdraw';
import { Avatar, Button, Space } from 'antd';
import Enums from '@/utils/enums';
import { useBoolean } from 'ahooks';
import CheckForm from '@/pages/finance/withdraw/components/CheckForm';
import TransForm from '@/pages/finance/withdraw/components/TransForm';
import dayjs from 'dayjs';


const WithdrawList = () => {
  const tableRef = useRef();
  const [currentRecord, setCurrentRecord] = useState();
  const [checkVisible, toggleCheckVisible] = useBoolean(false);
  const [transVisible, toggleTransVisible] = useBoolean(false);

  const check = record => {
    setCurrentRecord(record);
    toggleCheckVisible.setTrue();
  };
  const trans = record => {
    setCurrentRecord(record);
    toggleTransVisible.setTrue();
  };


  const columns = [
    {
      title: '提现用户',
      dataIndex: 'nickname',
      align: 'center',
      width: 200,
      formItemProps:{
        name:'user'
      },
      render: (_,{nickname,avatar,mobile}) => {
        return <Space>
          <Avatar src={avatar} />
          <Space direction={'vertical'}>
            <b>{nickname}</b>
            <span>{mobile}</span>
          </Space>
        </Space>;
      },
    },
    {
      title: '提现单号',
      dataIndex: 'withdrawNo',
      width: 200,
      align: 'center',
    },
    {
      title: '申请时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      align: 'center',
      width: 200,
      hideInSearch: true,
    },
    {
      title: '提现金额',
      dataIndex: 'withdrawMoney',
      align: 'center',
      width: 200,
      valueType: 'money',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'state',
      width: 200,
      align: 'center',
      valueType: 'radioButton',
      fieldProps: {
        buttonStyle: 'solid',
      },
      valueEnum: Enums.withdrawState,
      render: (it, { rejectReason }) => {
        return <Space size={'small'} direction={'vertical'}>
          {it}
          {rejectReason && <span style={{ fontSize: 8 }}>{rejectReason}</span>}
        </Space>;
      },
    },
    {
      title: '审核时间',
      dataIndex: 'checkTime',
      valueType: 'dateTime',
      align: 'center',
      width: 200,
      hideInSearch: true,
    },
    {
      title: '转账时间',
      dataIndex: 'transTime',
      valueType: 'dateTime',
      align: 'center',
      width: 200,
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      align: 'center',
      fixed: 'right',
      width:80,
      render: (_, record) => {
        const state = Enums.withdrawState[record.state];
        return <Space>
          {state === Enums.withdrawState.WAIT_AGREE && <Button type={'link'} onClick={() => check(record)}>审核</Button>}
          {state === Enums.withdrawState.WAIT_PAY && <Button type={'link'} onClick={() => trans(record)}>转账</Button>}
        </Space>;
      },
    },
  ];

  const onCheckFinish = () => {
    setCurrentRecord(null);
    toggleCheckVisible.setFalse();
    tableRef.current.reload();
    return true;
  };
  const onTransFinish = () => {
    setCurrentRecord(null);
    toggleTransVisible.setFalse();
    tableRef.current.reload();
    return true;
  };
  return (
    <PageContainer>
      <ProTable
        actionRef={tableRef}
        size={'small'}
        request={WithdrawApi.page}
        rowKey='id'
        columns={columns}
        scroll={{x:1000}}
      />
      <CheckForm onFinish={onCheckFinish} onVisibleChange={toggleCheckVisible.toggle} visible={checkVisible}
                 record={currentRecord} />
      <TransForm onFinish={onTransFinish} onVisibleChange={toggleTransVisible.toggle} visible={transVisible} record={currentRecord} />
    </PageContainer>
  );
};


export default WithdrawList;
