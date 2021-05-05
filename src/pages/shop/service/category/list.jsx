import React, { useEffect, useRef, useState } from 'react';
import { Button, Image, message, Popconfirm, Space } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import ServiceCategoryApi from '@/services/shop/service-category';
import ServiceCategoryForm from '@/pages/shop/service/category/components/ServiceCategoryForm';

const ServiceCategoryList = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [dataId, setDataId] = useState();
  const [parentId, setParentId] = useState();

  const tableRef = useRef();

  useEffect(() => {
    if (!formVisible) {
      setDataId(null);
      setParentId(null);
    }
  }, [formVisible]);

  const editRecord = (id) => {
    setDataId(id);

    setFormVisible(true);
  };
  const addChild = (parent_id) => {
    setParentId(parent_id);
    setFormVisible(true);
  };
  const removeRecord = async id => {
    const hide = message.loading('正在删除');
    try {
      await ServiceCategoryApi.remove({ id });
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
      title: '排序',
      dataIndex: 'sort',
    },
    {
      title: '分类图标',
      dataIndex: 'pic',
      render:(it,{parent_id})=>{
        return parent_id&&<Image src={it} width={50} height={50}/>
      }
    },
    {
      title: '是否显示',
      dataIndex: 'show',
      initialValue: true,
      valueEnum: {
        true: { text: '显示中', status: 'Processing' },
        false: { text: '隐藏', status: 'Error' },
      },
    },
    {
      title: '创建时间',
      dataIndex: '_add_time_str',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, { _id, parent_id }) => (<Space>
        <Button type={'link'} onClick={() => editRecord(_id)}>修改</Button>
        {!parent_id && <Button type={'link'} onClick={() => addChild(_id)}>添加下级</Button>}
        <Popconfirm title={'确认删除?'} onConfirm={() => removeRecord(_id)}
                    okButtonProps={{ type: 'primary', danger: true }}>
          <Button type={'link'} danger>删除</Button>
        </Popconfirm>
      </Space>),
    }];
  return (
    <PageContainer>
      <ProTable
        pagination={false}
        search={false}
        expandable={{
          rowExpandable: record => {
            return !!record.children?.length;
          },
        }}
        actionRef={tableRef} request={ServiceCategoryApi.list} toolBarRender={() => [
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
      <ServiceCategoryForm visible={formVisible} onVisibleChange={setFormVisible} id={dataId} parentId={parentId}
                           onFinish={() => {
                             tableRef?.current?.reload();
                             return true;
                           }} />
    </PageContainer>
  );

};


export default ServiceCategoryList;
