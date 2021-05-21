import React, { useRef } from 'react';
import { Button, message, Popconfirm, Space } from 'antd';
import { history } from '@@/core/history';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import dayjs from 'dayjs';
import LuckyApi from '@/services/promotion/lucky';


const LuckyList = () => {
  const configTabRef = useRef();

  const removeRecord = async id => {
    await LuckyApi.remove({ id });
    message.success('删除成功');
    configTabRef?.current?.reload();
  };

  const columns = [
    {
      title: '抽奖名称',
      dataIndex: 'name',
      width: 200,
      align: 'center',
    },
    {
      title: '中奖概率',
      dataIndex: 'probability',
      align: 'center',
      order: 2,
      valueType: 'percent',
    },
    {
      title: '每次消耗积分',
      dataIndex: 'integral_cost',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '每日参与次数',
      dataIndex: 'period',
      align: 'center',
      render: v => {
        if (v === 0) {
          return '不限制';
        }
        return `每日${v}次`;
      },
    },
    {
      title: '参与次数',
      dataIndex: 'join_count',
      align: 'center',
    },
    {
      title: '中奖次数',
      dataIndex: 'win_count',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '活动时间',
      dataIndex: 'start_time',
      align: 'center',
      width: 200,
      render: (_, { start_time, end_time }) => {
        return `${dayjs(start_time).format('YYYY-MM-DD')} - ${dayjs(end_time).format('YYYY-MM-DD')}`;
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      align: 'center',
      render: (_, { _id }) => (<Space>
        <Button type={'link'} onClick={() => history.push(`./edit?id=${_id}`)}>修改</Button>
        <Popconfirm title={'确认删除?'} onConfirm={() => removeRecord(_id)}
                    okButtonProps={{ type: 'primary', danger: true }}>
          <Button type={'link'} danger>删除</Button>
        </Popconfirm>
      </Space>),
    }];


  return <PageContainer>
    <ProCard tabs={{ type: 'card' }}>
      <ProCard.TabPane key='tab1' tab='幸运抽奖'>
        <ProTable
          size={'small'}
          actionRef={configTabRef} request={LuckyApi.page} search={false} toolBarRender={() => [
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
      </ProCard.TabPane>
      {/*<ProCard.TabPane key='tab2' tab='充值记录'>*/}
      {/*  <ProTable*/}
      {/*    size={'small'}*/}
      {/*    actionRef={configTabRef} request={RechargeApi.pageRecord}*/}
      {/*    rowKey='_id'*/}
      {/*    columns={recordColumns}*/}
      {/*  />*/}
      {/*</ProCard.TabPane>*/}

    </ProCard>
  </PageContainer>;
};


export default LuckyList;
