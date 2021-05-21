import React, { useEffect, useMemo, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Checkbox, Col, Menu, message, Modal, Pagination, Popconfirm, Row, Space, Spin, Upload } from 'antd';
import ProCard from '@ant-design/pro-card';
import MaterialCategoryApi from '@/services/material-category';
import MaterialCategoryForm from '@/pages/shop/album/components/MaterialCategoryForm';
import MaterialApi from '@/services/material';
import MaterialImage from '@/components/MaterialPicker/MaterialImage';
import copy from 'copy-to-clipboard';
import UploadUtil from '@/utils/upload';
import { UploadOutlined } from '@ant-design/icons';
import { ModalForm, ProFormSelect } from '@ant-design/pro-form';
import { useRequest } from 'umi';
import { useBoolean } from 'ahooks';


const AlbumManage = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [moveData, setMoveData] = useState(null);
  const [changeCategoryVisible, setChangeCategoryVisible] = useState(false);
  const [dataId, setDataId] = useState();
  const [checkItems, setCheckItems] = useState([]);
  const [currentKey, setCurrentKey] = useState('all');
  const [addMaterialLoading, setMaterialLoading] = useState(false);
  const listCategoryRequest = useRequest(MaterialCategoryApi.list);
  const [hasCheckedAll,toggleHasCheckedAll] = useBoolean(false)

  const pageRequest = useRequest(({ current, pageSize }) => MaterialApi.page({
    current,
    pageSize,
    category: currentKey === 'all' ? null : currentKey,
  }), {
    paginated: true,
    defaultPageSize: 12,
    refreshDeps: [currentKey],
    formatResult: res => {
      return { total: res.total, list: res.data };
    },
  });
  const categories = useMemo(() => {
    const result = [{
      name: '默认分组',
      key: 'all',
    }];
    listCategoryRequest.data?.forEach(({ name, _id }) => {
      result.push({
        name,
        key: _id,
      });
    });
    return result;
  }, [listCategoryRequest.data]);

  const currentCategory = useMemo(() => {
    return categories.find(it => it.key === currentKey);
  }, [categories, currentKey]);

  const editCategory = () => {
    setDataId(currentKey);
    setFormVisible(true);
  };


  const hasChecked = useMemo(() => {
    return fileUrl => {
      return checkItems.includes(fileUrl);
    };
  }, [checkItems]);

  const checkMaterial = fileUrl => {
    const findIdx = checkItems.findIndex(it => it === fileUrl);
    if (findIdx >= 0) {
      const newCheckItems = [...checkItems];
      newCheckItems.splice(findIdx, 1);
      setCheckItems(newCheckItems);
    } else {
      setCheckItems([...checkItems, fileUrl]);
    }
  };

  const customRequest = async ({
                                 file,
                                 onError,
                                 onSuccess,
                               }) => {

    const hide = message.loading('上传中');
    setMaterialLoading(true);
    try {
      const fileUrl = await UploadUtil.uploadFile(file);
      await MaterialApi.add({
        file_url: fileUrl,
        name: file.name,
        category: currentKey === 'all' ? null : currentKey,
      });
      onSuccess(fileUrl);
      pageRequest.run({ current:1, pageSize:12 })
    } catch (e) {
      message.error(e.message);
      onError(e, file);
    } finally {
      setMaterialLoading(false);
      hide();
    }
  };


  const removeCategory = async () => {
    Modal.confirm({
      title: '删除分组提示',
      content: '仅删除分组，不删除图片，分组内图片将自动归入默认分组',
      centered: true,
      onOk: async () => {
        await MaterialCategoryApi.remove({ id: currentKey });
        message.success('删除成功');
        listCategoryRequest.refresh();
        setCurrentKey('all');
      },
    });
  };
  const removeMaterial = async (id) => {
    const hide = message.loading('正在删除');
    try {
      await MaterialApi.remove({ ids:[id] });
      message.success('删除成功');
      pageRequest.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      hide();
    }
  };
  const copyUrl = url => {
    copy(url);
    message.success('复制图片链接成功');
  };

  const changeCategory = async ({ category }) => {
    await MaterialApi.move({
      ids: moveData.ids,
      category: category === 'all' ? null : category,
    });
    setMoveData(null);
    pageRequest.refresh()
    return true;
  };


  useEffect(() => {
    if (checkItems.length === pageRequest?.data?.list.length) {
      toggleHasCheckedAll.setTrue();
    } else {
      toggleHasCheckedAll.setFalse();
    }
  }, [checkItems]);

  useEffect(()=>{
    setCheckItems([]);
    toggleHasCheckedAll.setFalse();
  },[pageRequest.data])


  const checkAllChange=(e)=>{
    const value = e.target.checked;
    if (value) {
      setCheckItems(pageRequest.data?.list?.map(it=>it.file_url))
    }else{
      setCheckItems([])
    }
    toggleHasCheckedAll.toggle(value)
  }


  const batchRemove= ()=>{
    Modal.confirm({
      title: '确认删除?',
      centered: true,
      okButtonProps:{
        type: 'primary',
        danger: true,
      },
      onOk:async ()=>{
        const hide = message.loading('正在删除');
        const checkIds = pageRequest?.data?.list.filter(it=>checkItems.includes(it.file_url)).map(it=>it._id)
        try {
          await MaterialApi.remove({ ids:checkIds });
          message.success('删除成功');
          pageRequest.refresh();
        } catch (e) {
          console.error(e);
        } finally {
          hide();
        }
      }
    })
  }
  const batchMove= ()=>{
    setMoveData({
      ids: pageRequest?.data?.list.filter(it => checkItems.includes(it.file_url)).map(it => it._id),
      category: currentKey,
    });
    setChangeCategoryVisible(true)
  }

  return (
    <PageContainer>
      <ProCard>
        <ProCard ghost>
          <ProCard ghost colSpan='200px' bodyStyle={{ textAlign: 'center' }}>
            <Menu
              style={{ width: 200, height: 600, overflowX: 'hidden', overflowY: 'auto', borderRight: 'none' }}
              selectedKeys={[currentKey]}
              onSelect={({ key }) => setCurrentKey(key)}
              defaultSelectedKeys={[currentKey]}
              mode='inline'
            >
              {categories.map(it => (
                <Menu.Item key={it.key}>{it.name}</Menu.Item>
              ))}
            </Menu>
            <Button onClick={() => setFormVisible(true)}>新增分组</Button>
          </ProCard>
          <ProCard title={<>
            <span style={{ fontWeight: 'bold' }}>{currentCategory?.name}</span>
            <Button disabled={currentKey === 'all'} type={'link'} onClick={editCategory}>修改分组</Button>
            <Button disabled={currentKey === 'all'} type={'link'} onClick={removeCategory} danger>删除分组</Button>
          </>} extra={<Upload multiple
                              customRequest={customRequest}
                              showUploadList={false}><Button
            loading={addMaterialLoading}
            icon={<UploadOutlined />}
            type={'primary'}>上传</Button></Upload>}
          >
            <Spin spinning={pageRequest.loading}>

              <Row gutter={16}>
                {pageRequest.data?.list.map(it => {
                  return <Col key={it._id} xs={24} md={8} lg={4}>
                    <Space direction={'vertical'}>
                      <MaterialImage  checked={hasChecked(it.file_url)}
                                      onChange={checkMaterial} fileUrl={it.file_url} />
                      <div style={{ textAlign: 'center' }}>
                        <Space size={'small'}>
                          <a onClick={() => window.open(it.file_url)}>查看</a>
                          <a onClick={() => copyUrl(it.file_url)}>链接</a>
                          <a onClick={() => {
                            setMoveData({ ids:[it._id],category:it.category });
                            setChangeCategoryVisible(true);
                          }}>分组</a>
                          <Popconfirm title={'确认删除?'} onConfirm={() => removeMaterial(it._id)}
                                      okButtonProps={{ type: 'primary', danger: true }}>
                            <a>删除</a>
                          </Popconfirm>
                        </Space>
                      </div>
                    </Space>
                  </Col>;
                })}
              </Row>
              <Pagination {...pageRequest.pagination} size={'small'} showSizeChanger={false}
                          style={{ marginTop: 16, textAlign: 'right' }} />
              <Space size={'small'}>
                <Checkbox checked={hasCheckedAll} onChange={checkAllChange} />全选
                <Button type={'primary'} disabled={!checkItems.length} onClick={batchMove}>批量分组</Button>
                <Button type={'primary'} disabled={!checkItems.length} onClick={batchRemove} danger>批量删除</Button>
              </Space>

            </Spin>
          </ProCard>
        </ProCard>
      </ProCard>
      <MaterialCategoryForm visible={formVisible} onVisibleChange={setFormVisible} id={dataId} onFinish={() => {
        setDataId(null);
        listCategoryRequest.refresh();
        return true;
      }} />
      <ModalForm width={400} title={'移动分组'} visible={changeCategoryVisible} onVisibleChange={setChangeCategoryVisible}
                 onFinish={changeCategory} modalProps={{ destroyOnClose: true }}>
        <ProFormSelect
          width='md'
          name='category'
          options={categories.map(it => ({ label: it.name, value: it.key }))}
          initialValue={moveData?.category || 'all'}
          allowClear={false}
        />
      </ModalForm>
    </PageContainer>
  );
};


export default AlbumManage;
