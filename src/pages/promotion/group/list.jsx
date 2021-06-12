import React, { useRef } from 'react';
import { Button, Image, message, Modal, Space } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import { history } from 'umi';
import GroupApi from '@/services/promotion/group';
import moment from 'moment';
import ProCard from '@ant-design/pro-card';
import RecordTable from '@/pages/promotion/group/components/recordTable';


const expandedRowRender = row => {
  return <ProCard>
    <ProTable size={'small'}
              columns={[
                {
                  title: '序号',
                  dataIndex: 'index',
                  valueType: 'indexBorder',
                  width: 50,
                },
                { title: '规格名称', dataIndex: 'name' },
                {
                  title: '图片',
                  dataIndex: 'pic',
                  valueType: 'image',
                  fieldProps: {
                    preview: {
                      mask: false,
                    },
                  },
                },
                { title: '价格', dataIndex: 'price', valueType: 'money' },
                { title: '团购价格', dataIndex: 'groupPrice', valueType: 'money' },
                { title: '单位', dataIndex: 'unit' },
                { title: '起售数量', dataIndex: 'minNum' },

              ]}
              headerTitle={false}
              search={false}
              options={false}
              dataSource={row.skus}
              pagination={false}
    /></ProCard>;
};

const pageRequest = async (params) => {
  if (typeof params.enable === 'string') {
    params.enable = params.enable === 'true';
  }
  const res = await GroupApi.page(params);

  const { data } = res;
  const newData = data.map(group => {
    if (!group.service.id) {
      return {
        ...group,
        service: {
          name: '服务已删除',
        },
      };
    }
    const originSkus = group.service.skus;
    const groupSkus = group.skus;
    const mergeSkus = [];
    groupSkus.forEach(groupSku => {
      const originSku = originSkus.find(it => it.id === groupSku.id) || {};
      mergeSkus.push({
        ...originSku,
        ...groupSku,
        name: originSku.name || '规格已删除',
      });
    });
    return { ...group, skus: mergeSkus };
  });

  return {
    ...res,
    data: newData,
  };
};
const GroupList = () => {

  const groupRef = useRef();


  const removeRecord = id => {
    Modal.confirm({
      title: '删除提示',
      okButtonProps: {
        danger: true,
      },
      centered: true,
      content: '确定要删除拼团商品吗？\n删除拼团商品后将无法恢复，请谨慎操作！',
      onOk: async () => {
        await GroupApi.remove(id);
        message.success('删除成功');
        groupRef?.current?.reload();
      },
    });
  };
  const changeState = async (id, enable) => {
    const hide = message.loading('变更状态中');
    try {
      await GroupApi.changeState({id, enable});
      message.success('变更状态成功');
      groupRef?.current?.reload();
    } catch (e) {
      console.error(e);
    } finally {
      hide();
    }
  };

  const columns = [
    {
      title: '拼团名称',
      dataIndex: 'name',
    },
    {
      title: '拼团商品',
      dataIndex: 'service',
      render: (service) => {
        return <Space><Image src={service.mainPic} width={50} height={50} /><span>{service.name}</span></Space>;
      },
      width: 200,
    },
    {
      title: '活动时间',
      dataIndex: 'startTime',
      hideInSearch: true,
      render: (_, { startTime, endTime }) => {
        return `${moment(startTime).format('YYYY-MM-DD')} ~ ${moment(endTime).format('YYYY-MM-DD')}`;
      },
      width: 200,
    },
    {
      title: '成团人数',
      dataIndex: 'joinMin',
      hideInSearch: true,
    },
    {
      title: '拼团有效期',
      dataIndex: 'joinHours',
      hideInSearch: true,
    },
    {
      title: '开团数',
      dataIndex: 'groupNum',
      hideInSearch: true,
    },
    {
      title: '参与人数',
      dataIndex: 'joinNum',
      hideInSearch: true,
    },
    {
      title: '成团数',
      dataIndex: 'successNum',
      hideInSearch: true,
    },

    {
      title: '虚拟成团',
      dataIndex: 'allowVirtual',
      hideInSearch: true,
      render: it => it ? '开启' : '关闭',
    },
    {
      title: '状态',
      dataIndex: 'enable',
      valueType: 'radio',
      fieldProps: {
        buttonStyle: 'solid',
      },
      valueEnum: {
        true: { text: '已开启', status: 'Processing' },
        false: { text: '已关闭', status: 'Error' },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, { id, enable }) => (<Space>
        <Button type={'link'} onClick={() => history.push(`./edit?id=${id}`)}>修改</Button>
        <Button type={'link'} onClick={() => changeState(id, !enable)}>{enable ? '关闭' : '开启'}</Button>
        <Button type={'link'} danger onClick={() => removeRecord(id)}>删除</Button>
      </Space>),
    }];
  return <PageContainer>
    <ProCard tabs={{ type: 'card' }}>
      <ProCard.TabPane key='list' tab='活动列表'>
        <ProTable
          size={'small'}
          actionRef={groupRef} request={pageRequest} toolBarRender={() => [
          <Button
            type='primary'
            key='primary'
            onClick={() => history.push('./add')}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
          rowKey='id'
          expandable={{
            expandedRowRender,
          }}
          columns={columns}
        />
      </ProCard.TabPane>
      <ProCard.TabPane key='record' tab='拼团记录'>
        <RecordTable />
      </ProCard.TabPane>
    </ProCard>
  </PageContainer>;
};


export default GroupList;
