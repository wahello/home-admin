import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Checkbox, Menu, message, Modal, Popconfirm, Space, Upload } from 'antd';
import ProCard from '@ant-design/pro-card';
import MaterialCategoryApi from '@/services/material-category';
import MaterialCategoryForm from '@/pages/shop/album/components/MaterialCategoryForm';
import MaterialApi from '@/services/material';
import MaterialImage from '@/components/MaterialPicker/MaterialImage';
import ProList from '@ant-design/pro-list';
import copy from 'copy-to-clipboard';
import UploadUtil from '@/utils/upload';
import { UploadOutlined } from '@ant-design/icons';
import { ModalForm, ProFormSelect } from '@ant-design/pro-form';
import { useRequest } from 'umi';


const AlbumManage = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [material, setMaterial] = useState(null);
  const [changeCategoryVisible, setChangeCategoryVisible] = useState(false);
  const [dataId, setDataId] = useState();
  const [checkItems, setCheckItems] = useState([]);
  const [currentKey, setCurrentKey] = useState('all');
  const [addMaterialLoading, setMaterialLoading] = useState(false);
  const listRef = useRef();
  const listCategoryRequest = useRequest(MaterialCategoryApi.list);
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



  const pageMaterial = useMemo(() => {
    return (page) => MaterialApi.page({ ...page, category: currentKey === 'all' ? null : currentKey });
  }, [currentKey]);

  useEffect(() => {
    listRef?.current?.reset();
  }, [currentKey]);

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
      listRef.current.reset();
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
        await MaterialCategoryApi.remove({ id:currentKey });
        message.success('删除成功');
        listCategoryRequest.refresh();
        setCurrentKey('all')
      },
    })
  };
  const removeMaterial = async (id) => {
    const hide = message.loading('正在删除');
    try {
      await MaterialApi.remove({ id });
      message.success('删除成功');
      listRef?.current?.reload();
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

  const changeCategory= async ({ category })=>{
    await  MaterialApi.update({
      id:material._id,
      category:category === 'all'?null:category,
    });
    setMaterial(null);
    listRef?.current?.reload();
    return true;
  }

  return (
    <PageContainer>
      <ProCard >
        <ProCard ghost>
          <ProCard ghost colSpan='200px' bodyStyle={{textAlign:'center'}}>
            <Menu
              style={{ width: 200, height: 600, overflowX: 'hidden', overflowY: 'auto',borderRight:'none' }}
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
            type={'primary'}>上传</Button></Upload>}>
            <ProList
              toolBarRender={false}
              actionRef={listRef}
              pagination={{
                defaultPageSize: 12,
                size: 'small',
                showSizeChanger: false,
              }}
              rowSelection
              grid={{ gutter: 16, column: 6, xs: 1, md: 3, lg: 3 }}
              request={pageMaterial}
              renderItem={(it) => <Space direction={'vertical'}>
                <MaterialImage key={it._id} checked={hasChecked(it.file_url)}
                               onChange={checkMaterial} fileUrl={it.file_url} />
                <div style={{ textAlign: 'center' }}>
                  <Space size={'small'}>
                    <a onClick={() => window.open(it.file_url)}>查看</a>
                    <a onClick={() => copyUrl(it.file_url)}>链接</a>
                    <a onClick={() => {
                      setMaterial(it);
                      setChangeCategoryVisible(true)
                    }}>分组</a>
                    <Popconfirm title={'确认删除?'} onConfirm={() => removeMaterial(it._id)}
                                okButtonProps={{ type: 'primary', danger: true }}>
                      <a>删除</a>
                    </Popconfirm>
                  </Space>
                </div>
              </Space>}
            />
          </ProCard>
        </ProCard>
      </ProCard>
      <MaterialCategoryForm visible={formVisible} onVisibleChange={setFormVisible} id={dataId} onFinish={() => {
        setDataId(null);
        listCategoryRequest.refresh();
        return true;
      }} />
      <ModalForm width={400} title={'移动分组'} visible={changeCategoryVisible} onVisibleChange={setChangeCategoryVisible} onFinish={changeCategory} modalProps={{destroyOnClose:true}}>
        <ProFormSelect
          width='md'
          name='category'
          options={categories.map(it=>({label:it.name,value:it.key}))}
          initialValue={material?.category||'all'}
          allowClear={false}
        />
      </ModalForm>
    </PageContainer>
  );
};


export default AlbumManage;
