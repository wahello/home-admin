import React, { useEffect, useRef, useState } from 'react';
import { Button, message, Popconfirm, Space } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import ArticleCategoryForm from '@/pages/cms/articleCategory/components/ArticleCategoryForm';
import ArticleCategoryApi from '@/services/cms/article-category';

const ArticleCategoryList = props => {
  const [formVisible, setFormVisible] = useState(false);
  const [dataId, setDataId] = useState();

  const tableRef = useRef();

  useEffect(() => {
    if (!formVisible) {
      setDataId(null);
    }
  }, [formVisible]);

  const editRecord = async id => {
    setDataId(id);
    setFormVisible(true);
  };
  const removeRecord = async id => {
    const hide = message.loading('正在删除');
    try {
      await ArticleCategoryApi.remove({ id });
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
      title: '分类名称',
      dataIndex: 'name',
    },
    {
      title: '创建时间',
      dataIndex: '_add_time_str',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, { _id }) => (<Space>
        <Button type={'link'} onClick={() => editRecord(_id)}>修改</Button>
        <Popconfirm title={'确认删除?'} onConfirm={() => removeRecord(_id)}
                    okButtonProps={{ danger: true, type: 'primary' }}>
          <Button type={'link'} size={'small'} danger>删除</Button>
        </Popconfirm>
      </Space>),
    }];
  return (
    <PageContainer>
      <ProTable
        pagination={false}
        search={false}
        size={'small'}
        actionRef={tableRef} request={ArticleCategoryApi.list} toolBarRender={() => [
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
      />
      <ArticleCategoryForm visible={formVisible} onVisibleChange={setFormVisible} id={dataId} onFinish={() => {
        tableRef?.current?.reload();
        return true;
      }} />
    </PageContainer>
  );


};


export default ArticleCategoryList;
