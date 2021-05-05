import React, { useEffect, useRef, useState } from 'react';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, message, Popconfirm, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PermissionApi from '@/services/system/permission';
import PermissionForm from './components/PermissionForm';

const PermissionList = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [dataId, setDataId] = useState();

  const tableRef = useRef();

  useEffect(() => {
    if (!formVisible) {
      setDataId(null);
    }
  }, [formVisible]);

  const editRecord = id => {
    setDataId(id);
    setFormVisible(true);
  };
  const removeRecord = async id => {
    const hide = message.loading('正在删除');
    try {
      await PermissionApi.remove({ id });
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
      title: '权限名称',
      dataIndex: 'permission_name',
    },
    {
      title: '权限标识',
      dataIndex: 'permission_id',
    },
    {
      title: '备注',
      dataIndex: 'comment',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, { _id }) => (<Space>
        <Button size={'small'} type={'primary'} onClick={() => editRecord(_id)}>修改</Button>
        <Popconfirm title={'确认删除?'} onConfirm={() => removeRecord(_id)}>
          <Button size={'small'} danger>删除</Button>
        </Popconfirm>
      </Space>),
    }];
  return (
    <PageContainer>
      <ProTable actionRef={tableRef} request={PermissionApi.page} toolBarRender={() => [
        <Button
          type='primary'
          key='primary'
          onClick={() => setFormVisible(true)}
        >
          <PlusOutlined /> 新建
        </Button>,
      ]}
                rowKey='_id'
                columns={columns}
      >

      </ProTable>
      <PermissionForm visible={formVisible} onVisibleChange={setFormVisible} id={dataId} onFinish={() => {
        tableRef?.current?.reload();
        return true;
      }} />
    </PageContainer>
  );
};


export default PermissionList;
