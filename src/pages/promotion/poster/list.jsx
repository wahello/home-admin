import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, message, Popconfirm, Space, Tag } from 'antd';
import { history } from '@@/core/history';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import PosterApi from '@/services/promotion/poster';
import GenForm from '@/pages/promotion/poster/components/GenForm';
import { useBoolean } from 'ahooks';


const PosterList = props => {
  const configTabRef = useRef();

  const [genVisible, toggleGenVisible] = useBoolean(false);
  const [poster, setPoster] = useState();

  const removeRecord = async id => {
    await PosterApi.remove(id);
    message.success('删除成功');
    configTabRef?.current?.reload();
  };

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '海报类型',
      dataIndex: 'type',
      align: 'center',
      valueEnum: { CLIENT: { value: 'CLIENT', text: '用户分享' },OFFLINE: { value: 'OFFLINE', text: '线下广告' } },
    },
    {
      title: '海报图片',
      dataIndex: 'pic',
      valueType: 'image',
      align: 'center',
      fieldProps: {
        width: 100,
      },
    },
    {
      title: '二维码颜色',
      dataIndex: 'lineColor',
      align: 'center',
      render: (it, { auto_color }) => {
        return auto_color ? '自动识别' : <Tag color={it} style={{ width: 50, height: 20 }} />;
      },
    },
    {
      title: '是否透明',
      dataIndex: 'isHyaline',
      align: 'center',
      render: it => it ? '是' : '否',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      align: 'center',
      render: (_, record) => (<Space>
        <Button type={'link'} onClick={() => history.push(`./edit?id=${record.id}`)}>修改</Button>
        <Button type={'link'} onClick={() => {
          setPoster(record);
          toggleGenVisible.setTrue();
        }}>生成海报</Button>
        <Popconfirm title={'确认删除?'} onConfirm={() => removeRecord(record.id)}
                    okButtonProps={{ type: 'primary', danger: true }}>
          <Button type={'link'} danger>删除</Button>
        </Popconfirm>
      </Space>),
    },
  ];


  return <PageContainer>
    <ProTable
      size={'small'}
      actionRef={configTabRef} request={PosterApi.page} search={false} toolBarRender={() => [
      <Button
        type='primary'
        key='primary'
        onClick={() => history.push('./add')}
      >
        <PlusOutlined /> 新建
      </Button>,
    ]}
      rowKey='id'
      columns={columns}
    />
    <GenForm onVisibleChange={toggleGenVisible.toggle} visible={genVisible} poster={poster} />
  </PageContainer>;
};


export default PosterList;
