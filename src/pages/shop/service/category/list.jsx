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
  const addChild = (parentId) => {
    setParentId(parentId);
    setFormVisible(true);
  };
  const removeRecord = async id => {
    const hide = message.loading('正在删除');
    try {
      await ServiceCategoryApi.remove(id);
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
      render: (it, { parentId }) => {
        return parentId && <Image src={it} width={50} height={50} />;
      },
    },
    {
      title: '是否显示',
      dataIndex: 'showFlag',
      initialValue: true,
      valueEnum: {
        true: { text: '显示中', status: 'Processing' },
        false: { text: '隐藏', status: 'Error' },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (<Space>
        <Button type={'link'} onClick={() => editRecord(record.id)}>修改</Button>
        {!record.parentId && <Button type={'link'} onClick={() => addChild(record.id)}>添加下级</Button>}
        <Popconfirm title={'确认删除?'} onConfirm={() => removeRecord(record.id)}
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
        actionRef={tableRef} request={ServiceCategoryApi.list}
        postData={items => {
          return items.map(item => {
            return {
              ...item,
              children: item.children?.map(child => {
                return {
                  ...child,
                  children: child.children.length ? child.children : undefined,
                };
              }),
            };
          });
        }}
        toolBarRender={() => [
          <Button
            type='primary'
            key='primary'
            onClick={() => setFormVisible(true)}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        rowKey='id'
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
