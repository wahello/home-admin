import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Image, message, Modal, Space, Upload } from 'antd';
import { useBoolean, useHover } from 'ahooks';
import { useRequest } from 'umi';
import ProList from '@ant-design/pro-list';
import { DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import MaterialApi from '@/services/material';
import UploadUtil from '@/utils/upload';
import MaterialCategoryApi from '@/services/material-category';
import MaterialImage from '@/components/MaterialPicker/MaterialImage';
import styles from './index.less';

const UploadBtn = ({ onClick, size }) => {
  return <div className={styles.uploadBtn} onClick={onClick} style={{ width: size, height: size }}>
    <PlusOutlined />
  </div>;
};
const PreviewImage = ({ size, src, onRemove }) => {
  const ref = useRef();
  const isHovering = useHover(ref);
  return <div className={styles.previewImage} style={{ width: size, height: size }} ref={ref}>
    <Image src={src} width={size} height={size} preview={false} />
    {isHovering && <div className={styles.mask}>
      <DeleteOutlined onClick={onRemove} />
    </div>}
  </div>;
};

const MaterialPicker = props => {

  const listRef = useRef();

  const [visible, toggleVisible] = useBoolean(false);
  const listCategoryRequest = useRequest(MaterialCategoryApi.list);
  const [addMaterialLoading, setMaterialLoading] = useState(false);
  const [checkItems, setCheckItems] = useState([]);
  const [currentKey, setCurrentKey] = useState('all');

  const pageMaterial = (page) => MaterialApi.page({ ...page, category: currentKey === 'all' ? null : currentKey });

  useEffect(() => {
    listRef?.current?.reset();
  }, [currentKey]);

  useEffect(() => {
    if (props.destroyOnClose) {
      setCheckItems([]);
    }
  }, [props.destroyOnClose, visible]);

  useEffect(() => {
    if (props.value) {
      if (typeof props.value === 'string') {
        setCheckItems([props.value]);
      } else {
        setCheckItems(props.value);
      }
    }
    setCheckItems([]);
  }, [props.value]);

  const categoryTabs = useMemo(() => {
    const tabs = [{
      tab: '默认分类',
      key: 'all',
    }];
    listCategoryRequest.data?.forEach(({ name, _id }) => {
      tabs.push({
        tab: name,
        key: _id,
      });
    });
    return tabs;
  }, [listCategoryRequest.data]);

  const hasChecked = useMemo(() => {
    return fileUrl => {
      return checkItems.includes(fileUrl);
    };
  }, [checkItems]);

  const checkMaterial = fileUrl => {
    if (props.mode === 'single') {
      if (checkItems.length) {
        setCheckItems([fileUrl]);
        return;
      }
    } else if (checkItems.length >= props.maxCount) {
      return;
    }
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

    try {
      setMaterialLoading(true);
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
    }
  };

  const removeImage = idx => {

    if (typeof props.value === 'string') {
      props.onChange(null);
    } else {
      const newImages = [...props.value];
      newImages.splice(idx, 1);
      props.onChange(newImages);
    }
  };

  const renderContent = useMemo(() => {
    if (props.customRender) {
      return props.customRender({ onClick: toggleVisible.setTrue });
    }
    if (props.mode === 'single') {
      return props.value ?
        <PreviewImage size={props.size} src={props.value} onRemove={removeImage} /> :
        <UploadBtn size={props.size} onClick={toggleVisible.setTrue} />;
    }
    return <Space>
      {props.value?.map((it, idx) => <PreviewImage key={it} size={props.size} src={it}
                                                   onRemove={() => removeImage(idx)} />)}
      {(props.value?.length || 0) < props.maxCount && <UploadBtn size={props.size} onClick={toggleVisible.setTrue} />}
    </Space>;
  }, [props.mode, props.value, props.maxCount]);

  const confirm = () => {
    if (props.mode === 'single') {
      props.onChange(checkItems?.[0]);
    } else {
      props.onChange(checkItems);
    }

    toggleVisible.setFalse();
  };
  return (
    <>
      <Modal centered footer={<Space><Button type={'primary'} onClick={confirm}>确定</Button><Button
        onClick={toggleVisible.setFalse}>返回</Button></Space>} maskClosable={false}
             bodyStyle={{ padding: 0 }} width={1000}
             visible={visible} onOk={toggleVisible.setTrue}
             onCancel={toggleVisible.setFalse}
      >
        <Card bodyStyle={{ height: 480 }} title={'选择素材'}
              tabList={categoryTabs}
              activeTabKey={currentKey}
              onTabChange={setCurrentKey}
              tabBarExtraContent={<Upload multiple
                                          customRequest={customRequest}
                                          showUploadList={false}><Button
                loading={addMaterialLoading}
                icon={<UploadOutlined />}
                type={'primary'}>上传</Button></Upload>}
        >
          <ProList
            toolBarRender={false}
            actionRef={listRef}
            className={styles.list}
            pagination={{
              defaultPageSize: 12,
              size: 'small',
              showSizeChanger: false,
              showTotal: false,
            }}
            grid={{ gutter: 16, column: 6, xs: 1, md: 3 }}
            request={pageMaterial}
            renderItem={({ _id, file_url }) => <MaterialImage key={_id} checked={hasChecked(file_url)}
                                                              onChange={checkMaterial} fileUrl={file_url} />}
          />
        </Card>
      </Modal>
      {renderContent}
    </>
  );
};

MaterialPicker.propTypes = {
  mode: PropTypes.oneOf(['single', 'multi']),
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  onChange: PropTypes.func,
  maxCount: PropTypes.number,
  customRender: PropTypes.func,
  size: PropTypes.number,
  destroyOnClose: PropTypes.bool,
};
MaterialPicker.defaultProps = {
  mode: 'single',
  maxCount: 9,
  size: 85,
  destroyOnClose: false,
};

export default MaterialPicker;
