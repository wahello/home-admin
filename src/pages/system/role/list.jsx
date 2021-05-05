import React, { useEffect, useRef, useState } from 'react';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, message, Popconfirm, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PermissionApi from '@/services/system/permission';
import RoleForm from './components/RoleForm';
import RoleApi from '@/services/system/role';

const RoleList = () => {
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
      await RoleApi.remove({ id });
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
      title: '角色名称',
      dataIndex: 'role_name',
    },
    {
      title: '角色标识',
      dataIndex: 'role_id',
    },
    {
      title: '权限',
      dataIndex: 'permissions',
      render: permissions => {
        return permissions.map(it => it.permission_name).join('|');
      },
      request: async () => {
        const { data } = await PermissionApi.list();
        return data?.map(it => ({
          value: it.permission_id,
          label: it.permission_name,
        }));
      },
    },
    {
      title: '备注',
      dataIndex: 'comment',
      hideInSearch:true
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
      <ProTable actionRef={tableRef} request={RoleApi.page} toolBarRender={() => [
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
      <RoleForm visible={formVisible} onVisibleChange={setFormVisible} id={dataId} onFinish={() => {
        tableRef?.current?.reload();
        return true;
      }} />
    </PageContainer>
  );
};


export default RoleList;
