import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Avatar, Image, Rate, Space, Switch } from 'antd';
import ProTable from '@ant-design/pro-table';
import EvaluateApi from '@/services/order/evaluate';

const EvaluateList = props => {
  const tableRef = useRef();
  const toggleShow = async (id, show_flag) => {
    try {
      await EvaluateApi.toggleShow({ id, show_flag });
    } catch (e) {
      console.log(e);
    }
  };

  const columns = [
    {
      title: '订单号',
      dataIndex: ['order', 'order_no'],
      width: 220,
      formItemProps: {
        name:'orderNo'
      },
      copyable: true,
    },
    {
      title: '服务信息',
      dataIndex: 'service',
      width: 200,
      formItemProps: {
        name:'serviceName'
      },
      render: (_, { service }) => <Space>
        <Image width={60} height={60} src={service.main_pic} />
        {service.name}
      </Space>,
    },
    {
      title: '用户',
      dataIndex: 'userInfo',
      formItemProps: {
        name: 'user',
      },
      fieldProps: {
        placeholder: '输入用户昵称、手机号查询',
      },
      align: 'center',
      render: userInfo => {
        return <Space>
          <Avatar src={userInfo.avatar} />
          <Space direction={'vertical'}>
            <b>{userInfo.nickname}</b>
            <span>{userInfo.mobile}</span>
          </Space>
        </Space>;
      },
    },
    {
      title: '评分',
      dataIndex: 'speed_rate',
      align: 'center',
      hideInSearch: true,
      render: (_, { speed_rate, quality_rate, attitude_rate }) => {
        return <Space size={1} direction={'vertical'}>
          <span style={{ fontSize: 12 }}>服务质量：<Rate disabled value={speed_rate} style={{ fontSize: 12 }} /></span>
          <span style={{ fontSize: 12 }}>服务态度：<Rate disabled value={quality_rate} style={{ fontSize: 12 }} /></span>
          <span style={{ fontSize: 12 }}>上门速度：<Rate disabled value={attitude_rate} style={{ fontSize: 12 }} /></span>
        </Space>;
      },
    },
    {
      title: '评价内容',
      dataIndex: 'content',
      align: 'center',
      hideInSearch: true,
      render: (v, { pics }) => {
        return <Space size={'small'} direction={'vertical'}>
          <span style={{ fontSize: 13 }}>{v}</span>
          {pics.map(it => <Image src={it} preview={{ mask: false }} width={40} height={40} />)}
        </Space>;
      },
    },
    {
      title: '评价时间',
      dataIndex: '_add_time_str',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '是否显示',
      dataIndex: 'show_flag',
      align: 'center',
      renderFormItem: (_, { fieldProps }) => {
        return <Switch style={{ width: 'unset' }} {...fieldProps} />;
      },
      render: (v, { _id }) => {
        return <Switch defaultChecked={v} onChange={checked => toggleShow(_id, checked)} />
      },
    },
  ];


  return (
    <PageContainer>
      <ProTable
        actionRef={tableRef} request={EvaluateApi.page}
        rowKey='_id'
        columns={columns}
        search={{
          collapseRender: false,
          defaultCollapsed: false,
        }}
      />
    </PageContainer>
  );
};


export default EvaluateList;
