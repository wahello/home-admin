import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import PageApi from '@/services/app/page';
import PageForm from '@/pages/app/page/components/PageForm';
import { useBoolean } from 'ahooks';
import { Button, Modal, Popconfirm, Space, Tag, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { history } from 'umi';


const PageList = props => {
  const tableRef = useRef();
  const [formVisible, toggleFormVisible] = useBoolean(false);
  const [editData, setEditData] = useState();

  const onSaveFinish = () => {
    tableRef?.current.reload();
    return true;
  };

  const edit = record => {
    setEditData(record);
    toggleFormVisible.setTrue();
  };
  const changeHome = record => {
    Modal.confirm({
      title: '确认将该页面设为首页？',
      centered: true,
      onOk: async () => {
        await PageApi.changeHome({ id: record._id });
        message.success('设置成功');
        tableRef?.current.reload();
      },
    });
  };

  const recordColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      align: 'center',
      hideInSearch: true,
      render: (it, { is_home }) => {
        return <>{it} {is_home && <Tag color={'blue'}>首页</Tag>}</>;
      },
    },
    {
      title: '添加时间',
      dataIndex: '_add_time_str',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '最后修改时间',
      dataIndex: 'update_time',
      valueType: 'dateTime',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      align: 'center',
      render: (_, record) => (<Space size={'large'}>
        <Button size={'small'} type={'link'} onClick={() => edit(record)}>修改</Button>
        {<Button size={'small'} type={'link'} onClick={() => changeHome(record)}
                 disabled={record.is_home}>设为首页</Button>}
        <Button size={'small'} type={'link'} onClick={() => history.push(`./pageDiy?id=${record._id}`)}>设计</Button>
        <Popconfirm title={'确认删除?'}>
          <Button size={'small'} type={'link'} danger>删除</Button>
        </Popconfirm>
      </Space>),
    },
  ];

  return (
    <PageContainer>
      <ProTable
        actionRef={tableRef}
        search={false}
        size={'small'}
        request={PageApi.page}
        rowKey='_id'
        columns={recordColumns}
        toolBarRender={() => [
          <Button
            type='primary'
            key='primary'
            onClick={toggleFormVisible.setTrue}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
      />
      <PageForm editData={editData} onFinish={onSaveFinish} onVisibleChange={toggleFormVisible.toggle}
                visible={formVisible} />
    </PageContainer>
  );
};


export default PageList;
