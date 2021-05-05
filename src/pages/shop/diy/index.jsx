import React, { useEffect, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { Button, Space, Spin } from 'antd';
import components from './components';
import SelectWrapper from '@/pages/shop/diy/components/SelectWrapper';
import uuid from 'uuid';
import PageSetting from '@/pages/shop/diy/components/PageSetting';
import SettingForm from '@/pages/shop/diy/components/SettingForm';
import MobilePreview from '@/pages/shop/diy/components/MobilePreview';
import { PageContainer } from '@ant-design/pro-layout';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import SourceBox from '@/pages/shop/diy/components/SourceBox';
import DiyContext from './DiyContext';

const defaultPageSettings = {
  title: '首页',
  titleColor: '#333333',
  bgColor: '#F8F8F8',
  navBgColor: '#FFF',
  navStyle: 'default',
  bgPic: [],
};

const s = {
  'page': {
    'title': '首页',
    'titleColor': '#333333',
    'bgColor': '#F8F8F8',
    'navBgColor': '#FFF',
    'navStyle': 'default',
    'bgPic': [],
  },
  'components': [{
    'key': 'search',
    'settings': {
      'placeholder': '搜索',
      'textColor': '#909399',
      'bgColor': 'transparent',
      'inputBgColor': '#ffffff',
      'shape': 'circle',
    },
  }, {
    'key': 'swiper',
    'settings': {
      'pics': [{ 'pic': 'https://v4.niuteam.cn/public/diy_view/style2/img/banner.png', 'path': 'www' }],
      'shape': 'circle',
    },
  }],
};


const Diy = () => {

  const [pageSettings, setPageSettings] = useState(defaultPageSettings);
  const [currentItem, setCurrentItem] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    setPageSettings(s.page);
    setItems(s.components.map(it => {
      const item = components.find(c => c.key === it.key);
      return { ...item, ...it, id: uuid() };
    }));
  }, []);


  const setPage = () => {
    setCurrentItem(null);
  };

  const handleSettingChange = ([{ name: [name], value }]) => {
    if (currentItem) {
      const newItems = [...items];
      const item = newItems.find(it => it.id === currentItem.id);
      item.settings = {
        ...item.settings,
        [name]: value,
      };
      setItems(newItems);
    } else {
      setPageSettings({
        ...pageSettings,
        [name]: value,
      });
    }
  };

  const handleSubmit = () => {
    const allSettings = {
      page: pageSettings,
      components: items.map(it => ({
        key: it.key,
        settings: it.settings,
      })),
    };
  };


  return <PageContainer title={false} breadcrumb={false}
                        footer={<div style={{ textAlign: 'center' }}><Space><Button type={'primary'}
                                                                                    onClick={handleSubmit}>保存</Button><Button
                          type={'primary'}>预览</Button></Space></div>}>
    <DiyContext.Provider value={{ items, setItems, currentItem, setCurrentItem }}>
      <DndProvider backend={HTML5Backend}>
        <ProCard ghost gutter={8} key={'container'}>
          <ProCard key={'components'} title={'组件列表'} colSpan='300px' bodyStyle={{ height: 690, overflow: 'auto' }}>
            <SourceBox   />
          </ProCard>
          <ProCard key={'preview'} layout='center' ghost style={{ position: 'relative' }}>
            <div>
              <Spin spinning={false}>
                <MobilePreview pageSettings={pageSettings} />
              </Spin>
            </div>
            <Button onClick={setPage} style={{ position: 'absolute', top: 0, right: 10 }}>页面设置</Button>
          </ProCard>

          <ProCard key={'setting'} title={currentItem?.name || '页面设置'} colSpan='400px'
                   bodyStyle={{ height: 690, overflow: 'auto' }}>
            <SettingForm changeSetting={handleSettingChange} settings={currentItem?.settings || pageSettings}>
              {currentItem?.setting || <PageSetting />}
            </SettingForm>
          </ProCard>
        </ProCard>
      </DndProvider>
    </DiyContext.Provider>
  </PageContainer>;
};


export default Diy;


