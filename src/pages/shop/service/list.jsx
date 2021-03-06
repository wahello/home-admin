import React, { useRef, useState } from 'react';
import { Button, Dropdown, Image, Menu, message, Modal, Popconfirm, Rate, Space, Tag, Tooltip } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import ServiceTagApi from '@/services/shop/service-tag';
import { history } from 'umi';
import ServiceApi from '@/services/shop/service';
import ServiceCategoryApi from '@/services/shop/service-category';
import Enums from '@/utils/enums';
import ProCard from '@ant-design/pro-card';


const expandedRowRender = row => {
  return <ProCard><ProTable size={'small'}
                            columns={[
                              {
                                title: '序号',
                                dataIndex: 'index',
                                valueType: 'indexBorder',
                                width: 50,
                              },
                              { title: '规格名称', dataIndex: 'name' },
                              { title: '价格', dataIndex: 'price', valueType: 'money' },
                              { title: '划线价格', dataIndex: 'linePrice', valueType: 'money' },
                              { title: '单位', dataIndex: 'unit' },
                              { title: '起售数量', dataIndex: 'minNum' },
                              {
                                title: '图片',
                                dataIndex: 'pic',
                                render: it => <Image src={it || row.main_pic} width={50} height={50} />,
                              },
                            ]}
                            headerTitle={false}
                            search={false}
                            options={false}
                            dataSource={row.skus}
                            pagination={false}
  /></ProCard>;
};

const stateTabs = [
  {
    label: '全部',
    key: 'all',
  },
  ...Object.values(Enums.serviceState).map(({ text, value }) => ({ label: text, key: value })),
];

const ServiceList = props => {

  const tableRef = useRef();
  const [activeKey, setActiveKey] = useState();

  const removeRecord = async id => {
    const hide = message.loading('正在删除');
    try {
      await ServiceApi.remove({ id });
      message.success('删除成功');
      tableRef?.current?.reload();
    } catch (e) {
      console.error(e);
    } finally {
      hide();
    }
  };

  const changeTab = key => {
    if (key === 'all') {
      setActiveKey(null);
    } else {
      setActiveKey(key);
    }
    tableRef?.current?.reloadAndRest();
  };

  const pageRequest = params => {
    const pageParams = params;
    if (activeKey) {
      pageParams.state = activeKey;
    }
    return ServiceApi.page(pageParams);
  };

  const changeState = async (id, state) => {
    const hide = message.loading('操作中');
    try {
      await ServiceApi.changeState({ id, state });
      message.success('操作成功');
      tableRef?.current?.reload();
    } catch (e) {
      console.log(e);
    } finally {
      hide();
    }
  };

  const copyService = (id) => {
    Modal.confirm({
      content: '确认复制该服务？',
      centered: true,
      onOk: async () => {
        await ServiceApi.copy({ id });
        message.success('复制成功');
        tableRef?.current?.reload();
      },
    });
  };

  const columns = [
    {
      title: '服务名称',
      dataIndex: 'name',
      render: (text, record) => {
        return <Space><Image src={record.mainPic} width={50} height={50} /><span>{text}</span></Space>;
      },
      width: 200,
    },
    {
      title: '服务分类',
      dataIndex: 'categoryName',
      valueType: 'select',
      formItemProps: {
        name: 'categoryId',
      },
      request: async () => {
        const { data: categoryList } = await ServiceCategoryApi.list();
        return categoryList?.map(({ id, name, children }) => ({
          value: id,
          label: name,
          children: children.map(it => ({ value: it.id, label: it.name })),
          optionType: 'optGroup',
        }));
      },
      width: 100,
    },
    {
      title: '标签',
      dataIndex: 'tags',
      formItemProps: {
        name: 'tagId',
      },
      render: (text) => {
        return <Space>
          {text.map(({ name }, idx) => <Tag key={idx}>{name}</Tag>)}
        </Space>;
      },
      request: async () => {
        const { data } = await ServiceTagApi.list();
        return data?.map(({ id, name }) => ({
          value: id,
          label: name,
        }));
      },
    },
    {
      title: '销量',
      dataIndex: 'virtualSales',
      hideInSearch: true,
      render: (virtualSales, { realSales }) => {
        return <Tooltip title={<Space direction={'vertical'}>
          <span>真实销量：{realSales}</span>
          <span>虚拟销量：{virtualSales}</span>
        </Space>}>
          <span>{virtualSales + realSales}</span>
        </Tooltip>;
      },
    },
    {
      title: '评分',
      dataIndex: 'score',
      render: it => <Rate style={{ fontSize: 10 }} disabled value={it} />,
      hideInSearch: true,
    },
    {
      title: '付款方式',
      dataIndex: 'payType',
      width: 100,
      valueEnum: Enums.payType,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      width: 150,
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'state',
      valueEnum: Enums.serviceState,
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      align: 'center',
      render: (_, { id, state }) => (<Space>
        <Button type={'link'} onClick={() => history.push(`/shop/service/edit?id=${id}`)}>修改</Button>
        {state === Enums.serviceState.NOT_SALE.value ?
          <Popconfirm title={'确认上架?'} onConfirm={() => changeState(id, Enums.serviceState.IN_SALE.value)}>
            <Button type={'link'} size={'small'}>上架</Button>
          </Popconfirm> :
          <Popconfirm title={'确认下架?'} onConfirm={() => changeState(id, Enums.serviceState.NOT_SALE.value)}>
            <Button type={'link'} size={'small'}>下架</Button>
          </Popconfirm>}
        <Popconfirm title={'确认删除?'} onConfirm={() => removeRecord(id)}
                    okButtonProps={{ type: 'primary', danger: true }}
                    disabled={state === Enums.serviceState.IN_SALE.value}>
          <Button disabled={state === Enums.serviceState.IN_SALE.value} type={'link'} size={'small'} danger>删除</Button>
        </Popconfirm>
        <Dropdown overlay={<Menu>
          <Menu.Item onClick={() => copyService(id)}>复制</Menu.Item>
          <Menu.Item>订单</Menu.Item>
          <Menu.Item>评论</Menu.Item>
        </Menu>}><Button type={'link'}>更多<DownOutlined /></Button></Dropdown>
      </Space>),
    }];
  return (
    <PageContainer>
      <ProTable
        actionRef={tableRef} request={pageRequest} toolBarRender={() => [
        <Button
          type='primary'
          key='primary'
          onClick={() => history.push('/shop/service/add')}
        >
          <PlusOutlined /> 新建
        </Button>,
      ]}
        rowKey='id'
        columns={columns}
        expandable={{
          expandedRowRender,
        }}
        search={{
          collapseRender: false,
          defaultCollapsed: false,
        }}
        toolbar={{
          menu: {
            type: 'tab',
            items: stateTabs,
            onChange: changeTab,
          },
        }}
      />
    </PageContainer>
  );

};


export default ServiceList;
