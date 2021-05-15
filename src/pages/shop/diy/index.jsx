import React, { useEffect, useMemo, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { Button, Form, message, Space, Spin } from 'antd';
import components from './components';
import PageSetting from '@/pages/shop/diy/components/PageSetting';
import MobilePreview from '@/pages/shop/diy/components/MobilePreview';
import { PageContainer } from '@ant-design/pro-layout';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import SourceBox from '@/pages/shop/diy/components/SourceBox';
import DiyContext from './DiyContext';
import DiyApi from '@/services/shop/diy';
import { useRequest } from 'umi';
import FormContext from '@/pages/shop/diy/components/FormContext';
import ProForm from '@ant-design/pro-form';

const defaultPageSettings = {
  title: '首页',
  titleColor: 'rgba(51,51,51,1)',
  bgColor: 'rgba(248,248,248,1)',
  navBgColor: 'rgba(255,255,255,1)',
  navStyle: 'default',
  bgPic: null,
};


const Diy = () => {

  const [form] = Form.useForm();
  const [currentItem, setCurrentItem] = useState(null);

  const getRequest = useRequest(DiyApi.getHome);
  const saveRequest = useRequest(DiyApi.updateHome, { manual: true });

  const [mpSetting, setMpSetting] = useState({
    page: defaultPageSettings,
    components: [],
  });

  useEffect(() => {
    if (getRequest.data) {
      setMpSetting(getRequest.data.setting);
      form.setFieldsValue(getRequest.data.setting.page);
    }

  }, [getRequest.data]);


  const setPage = () => {
    setCurrentItem(null);
  };

  const onFieldsChange = (e) => {
    const field = e[0];
    if (field) {
      const { name: [name], value } = field;
      if (currentItem) {
        const newMpSetting = { ...mpSetting };
        const item = newMpSetting.components.find(it => it.id === currentItem.id);
        item.settings = {
          ...item.settings,
          [name]: value,
        };
        setMpSetting(newMpSetting);
      } else {
        setMpSetting({
          ...mpSetting,
          page: {
            ...mpSetting.page,
            [name]: value,
          },
        });
      }

    }
  };

  const handleSubmit = async () => {
    await saveRequest.run({ setting: mpSetting });
    message.success('保存成功');
  };


  useEffect(() => {
    if (currentItem) {
      form.setFieldsValue(currentItem.settings);
    }else{
      form.setFieldsValue(mpSetting.page)
    }
  }, [currentItem]);

  const currentComponent = useMemo(() => {
    if (currentItem?.key) {
      return components.find(it => it.key === currentItem.key);
    }
    return null;
  }, [currentItem]);

  return <PageContainer title={false} breadcrumb={false}
                        footer={<div style={{ textAlign: 'center' }}><Space size={'large'}><Button type={'primary'}
                                                                                                   onClick={handleSubmit}
                                                                                                   loading={saveRequest.loading}>保存</Button><Button
                          type={'primary'}>预览</Button></Space></div>}>
    <DiyContext.Provider value={{ currentItem, setCurrentItem, mpSetting, setMpSetting }}>
      <DndProvider backend={HTML5Backend}>
        <ProCard ghost gutter={8} key={'container'}>
          <ProCard key={'components'} title={'组件列表'} colSpan='300px' bodyStyle={{ height: 690, overflow: 'auto' }}>
            <SourceBox />
          </ProCard>
          <ProCard key={'preview'} layout='center' ghost style={{ position: 'relative' }}>
            <div>
              <Spin spinning={false}>
                <MobilePreview />
              </Spin>
            </div>
            <Button onClick={setPage} style={{ position: 'absolute', top: 0, right: 10 }}>页面设置</Button>
          </ProCard>

          <ProCard key={'setting'} title={currentComponent?.name || '页面设置'} colSpan='450px'
                   bodyStyle={{ height: 690, overflow: 'auto' }}>
            <FormContext.Provider value={form}>
              <ProForm submitter={false} form={form} style={{ width: '100%' }} layout={'horizontal'}
                       onFieldsChange={onFieldsChange}>
                {currentComponent?.setting||<PageSetting/>}
              </ProForm>
            </FormContext.Provider>
          </ProCard>
        </ProCard>
      </DndProvider>
    </DiyContext.Provider>
  </PageContainer>;
};


export default Diy;


