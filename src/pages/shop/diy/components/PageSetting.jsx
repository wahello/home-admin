import React from 'react';
import PropTypes from 'prop-types';
import ProForm, { ProFormDependency, ProFormRadio, ProFormText } from '@ant-design/pro-form';
import ColorPicker from '@/components/ColorPicker';
import MaterialPicker from '@/components/MaterialPicker';

const PageSetting = props => {
  return (
    <>
      <ProFormText name={'title'} label={'页面标题'} fieldProps={{maxLength:10}} />
      <ProForm.Item name='titleColor' label={'标题颜色'}>
        <ColorPicker />
      </ProForm.Item>
      <ProFormRadio.Group
        name='navStyle'
        label='顶部样式'
        options={[
          {
            label: '默认',
            value: 'default',
          },
          {
            label: '透明',
            value: 'custom',
          },
        ]}
      />
      <ProFormDependency name={['navStyle']}>
        {
          ({ navStyle }) => {
            return navStyle==='default' && <ProForm.Item name='navBgColor' label={'顶部背景颜色'}>
              <ColorPicker />
            </ProForm.Item>;
          }
        }
      </ProFormDependency>

      <ProForm.Item name='bgColor' label={'背景颜色'}>
        <ColorPicker />
      </ProForm.Item>
      <ProForm.Item name='bgPic' label={'背景图片'}>
        <MaterialPicker />
      </ProForm.Item>
    </>
  );
};

PageSetting.propTypes = {};

export default PageSetting;
