import React from 'react';
import ProForm, { ProFormDependency, ProFormRadio, ProFormSlider, ProFormText } from '@ant-design/pro-form';
import PaddingGroup from '@/pages/app/diy/components/PaddingGroup';
import { Button } from 'antd';
import ServicePicker from '@/components/ServicePicker';
import { useBoolean } from 'ahooks';
import ColorPicker from '@/components/ColorPicker';


const PrivateServicePicker = ({ value, onChange }) => {

  const [serviceVisible, toggleServiceVisible] = useBoolean(false);

  const onChooseService = services => {
    onChange(services?.map(it => it._id));
    toggleServiceVisible.setFalse();
  };

  return <>
    <ServicePicker visible={serviceVisible} value={value?.map(_id => ({ _id }))} onChange={onChooseService}
                   onCancel={toggleServiceVisible.setFalse} />
    <Button type={'primary'} style={{ width: 150 }}
            onClick={toggleServiceVisible.setTrue}>选择{value?.length ? `(已选${value?.length}项)` : ''}</Button>
  </>;


};

const ServiceSetting = props => {


  return <>
    <ProForm.Group title={'基本设置'} collapsible>
      <ProFormRadio.Group
        name='type'
        label='展示风格'
        radioType={'button'}
        fieldProps={{ buttonStyle: 'solid' }}
        options={[
          {
            label: '大图',
            value: 1,
          },
          {
            label: '列表',
            value: 2,
          },
          {
            label: '卡片',
            value: 3,
          },
        ]}
      />
      <ProFormRadio.Group
        name='dataType'
        label='数据来源'
        radioType={'button'}
        fieldProps={{ buttonStyle: 'solid' }}
        options={[
          {
            label: '自动',
            value: 'auto',
          },
          {
            label: '手动',
            value: 'manual',
          },
        ]}
      />
      <ProFormDependency name={['dataType']}>
        {({ dataType }) => {
          return dataType === 'auto' ? <ProForm.Item label={'商品数量'} style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex' }}>
              <ProFormSlider width={150} min={0} max={20} name='autoNum'
                             fieldProps={{ tooltipVisible: false }} />
              <ProFormDependency name={['autoNum']}>
                {({ autoNum }) => <span style={{ marginTop: 5, marginLeft: 10 }}>{autoNum}</span>}
              </ProFormDependency>
            </div>
          </ProForm.Item> : <ProForm.Item name={'serviceIds'} label={'选择服务'}>
            <PrivateServicePicker />
          </ProForm.Item>;
        }}
      </ProFormDependency>
      <br />
      <ProForm.Item name='themeColor' label={'主题色'}>
        <ColorPicker allowTrans={false} />
      </ProForm.Item>
      <ProForm.Item name='btnColor' label={'按钮文字色'}>
        <ColorPicker allowTrans={false} />
      </ProForm.Item>
      <ProFormText name='btnText' label={'按钮文字'} />
    </ProForm.Group>

    <PaddingGroup max={100} />
  </>
    ;
};


export default ServiceSetting;
