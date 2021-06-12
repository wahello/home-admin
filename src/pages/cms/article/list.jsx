import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button, Popconfirm, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { history } from 'umi';
import ArticleApi from '@/services/cms/article';
import ArticleCategoryApi from '@/services/cms/article-category';


const ArticleList = props => {
  const tableRef = useRef();


  const recordColumns = [
    {
      title: '标题',
      dataIndex: 'title',
      align: 'center',
    },
    {
      title: '文章分类',
      dataIndex: 'category',
      align: 'center',
      valueType: 'select',
      request: async () => {
        const { data: categoryList } = await ArticleCategoryApi.list();
        return categoryList?.map(({ _id, name }) => ({
          value: _id,
          label: name,
        }));
      },
    },
    {
      title: '简介',
      dataIndex: 'desc',
      align: 'center',
      hideInSearch: true,
      width: 300,
    },
    {
      title: '文章封面',
      dataIndex: 'pic',
      align: 'center',
      valueType: 'image',
      hideInSearch: true,
      fieldProps: {
        width: 50,
        height: 50,
        preview: {
          mask: false,
        },
      },
    },
    {
      title: '阅读数',
      dataIndex: 'visit_count',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '添加时间',
      dataIndex: '_add_time_str',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      align: 'center',
      render: (_, record) => (<Space size={'large'}>
        <Button size={'small'} type={'link'}
                onClick={() => history.push(`/cms/article/edit?id=${record._id}`)}>修改</Button>
        <Popconfirm title={'确认删除?'}>
          <Button size={'small'} type={'link'} danger>删除</Button>
        </Popconfirm>
      </Space>),
    },
  ];

  return <PageContainer>
    <ProTable
      actionRef={tableRef}
      search={{
        collapseRender: false,
        defaultCollapsed: false,
      }}
      size={'small'}
      request={ArticleApi.page}
      rowKey='_id'
      columns={recordColumns}
      toolBarRender={() => [
        <Button
          type='primary'
          key='primary'
          onClick={() => history.push('/cms/article/add')}
        >
          <PlusOutlined /> 新建
        </Button>,
      ]}
    />
  </PageContainer>;
};


export default ArticleList;
