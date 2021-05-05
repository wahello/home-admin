import React, { useEffect, useRef, useState } from 'react';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, message, Popconfirm, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import UserApi from '@/services/system/user';
import RoleApi from '@/services/system/role';
import UserForm from '@/pages/system/user/components/UserForm';

const UserList = () => {

  const [formVisible, setFormVisible] = useState(false);
  const [dataId, setDataId] = useState();

  const tableRef = useRef();

  useEffect(() => {
    if (!formVisible) {
      setDataId(null);
    }
  }, [formVisible]);

  const editRecord =async id => {
    setDataId(id);
    setFormVisible(true);
  };
  const removeRecord = async id => {
    const hide = message.loading('正在删除');
    try {
      await UserApi.remove({ id });
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
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '角色',
      dataIndex: 'roles',
      render: text => {
        return text.map(it => it.role_name).join('|');
      },
      request: async () => {
        const { data } = await RoleApi.list();
        return data?.map(it => ({
          value: it.role_id,
          label: it.role_name,
        }));
      },
    },
    {
      title: '最后登录时间',
      dataIndex: 'last_login_date',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '最后登录IP',
      dataIndex: 'last_login_ip',
      hideInSearch: true,
    }, {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, { _id }) => (<Space>
        <Button size={'small'} type={'primary'} onClick={() => editRecord(_id)}>修改</Button>
        <Popconfirm title={'确认删除?'} onConfirm={() => removeRecord(_id)}>
          <Button type={'primary'} size={'small'} danger>删除</Button>
        </Popconfirm>
      </Space>),
    }];
  return (
    <PageContainer>
      <ProTable actionRef={tableRef} request={UserApi.page} toolBarRender={() => [
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
      <UserForm visible={formVisible} onVisibleChange={setFormVisible} id={dataId} onFinish={() => {
        tableRef?.current?.reload();
        return true;
      }} />
    </PageContainer>
  );
};


export default UserList;
