import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import PageApi from '@/services/app/page';
import PageForm from '@/pages/app/page/components/PageForm';
import { useBoolean } from 'ahooks';
import { Button, Image, message, Modal, Popconfirm, Space, Tag, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { useRequest } from '@@/plugin-request/request';
import moment from 'moment';
import copy from 'copy-to-clipboard';


const PageList = props => {
  const tableRef = useRef();
  const [formVisible, toggleFormVisible] = useBoolean(false);
  const [editData, setEditData] = useState();

  const onSaveFinish = () => {
    tableRef?.current.reload();
    return true;
  };

  const edit = record => {
    setEditData(record);
    toggleFormVisible.setTrue();
  };
  const changeHome = record => {
    Modal.confirm({
      title: '确认将该页面设为首页？',
      centered: true,
      onOk: async () => {
        await PageApi.changeHome(record.id);
        message.success('设置成功');
        tableRef?.current.reload();
      },
    });
  };
  const removePage = async id => {
    const hide = message.loading('正在删除');
    try {
      await PageApi.remove(id);
      message.success('删除成功');
      tableRef?.current?.reload();
    } catch (e) {
      console.error(e);
    } finally {
      hide();
    }
  };

  const qrCode = async ({ name,id }) => {
    const hide = message.loading('生成二维码中');
    try {
      const res = await PageApi.qrCode(id);
      Modal.confirm({
        title: '微页面二维码',
        icon: false,
        centered: true,
        content: <Image style={{marginTop:10}} width={200} height={200} preview={false} src={res.data} />,
        bodyStyle: { textAlign: 'center' },
        okText: '保存本地',
        cancelText: '关闭',
        onOk:()=>{
          const a = document.createElement("a");
          a.download = `小程序微页面-${name}.png`;
          a.href = res.data;
          document.body.append(a)
          a.click();
          a.remove()
        }
      });
    } catch (e) {
      console.error(e);
    } finally {
      hide();
    }
  };
  const schema = async (id) => {
    const hide = message.loading('生成链接中');
    try {
      const res = await PageApi.schema(id);
      Modal.confirm({
        title: '微页面短链接',
        icon: false,
        centered: true,
        cancelText: '关闭',
        okText: '复制链接',
        content: <Typography.Paragraph style={{marginTop:40}} copyable={false}>{res.data}</Typography.Paragraph>,
        bodyStyle: { textAlign: 'center' },
        onOk:()=>{
          copy(res.data)
          message.success('复制成功')
        }
      });
    } catch (e) {
      console.error(e);
    } finally {
      hide();
    }
  };



  const recordColumns = [
    {
      title: '页面名称',
      dataIndex: 'name',
      align: 'center',
      width: 300,
      hideInSearch: true,
      render: (it, { isHome }) => {
        return <>{it} {isHome && <Tag color={'blue'}>首页</Tag>}</>;
      },
    },
    {
      title: '分享标题',
      dataIndex: 'shareTitle',
      width: 300,
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '分享图片',
      dataIndex: 'shareImg',
      valueType: 'image',
      width: 300,
      align: 'center',
      fieldProps: {
        width:50,
        height:50,
        preview:{
          mask:false
        }
      },
      hideInSearch: true,
    },
    {
      title: '添加时间',
      dataIndex: 'createTime',
      align: 'center',
      valueType: 'dateTime',
      width: 300,
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      align: 'center',
      render: (_, record) => (<Space size={'large'}>
        <Button size={'small'} type={'link'} onClick={() => edit(record)}>修改</Button>
        {<Button size={'small'} type={'link'} onClick={() => changeHome(record)}
                 disabled={record.isHome}>设为首页</Button>}
        <Button size={'small'} type={'link'} onClick={() => history.push(`./pageDiy?id=${record.id}`)}>设计</Button>
        <Button size={'small'} type={'link'} onClick={() => qrCode(record)}>二维码</Button>
        <Button size={'small'} type={'link'} onClick={() => schema(record.id)}>短链接</Button>
        <Popconfirm title={'确认删除?'}>
          <Button size={'small'} type={'link'} onClick={() => removePage(record.id)} disabled={record.isHome}
                  danger>删除</Button>
        </Popconfirm>
      </Space>),
    },
  ];

  return (
    <PageContainer>
      <ProTable
        actionRef={tableRef}
        search={false}
        size={'small'}
        request={PageApi.page}
        rowKey='id'
        columns={recordColumns}
        toolBarRender={() => [
          <Button
            type='primary'
            key='primary'
            onClick={toggleFormVisible.setTrue}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
      />
      <PageForm editData={editData} onFinish={onSaveFinish} onVisibleChange={toggleFormVisible.toggle}
                visible={formVisible} />
    </PageContainer>
  );
};


export default PageList;
