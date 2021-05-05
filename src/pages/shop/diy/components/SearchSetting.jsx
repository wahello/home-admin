import React from 'react';
import ProForm, { ProFormRadio, ProFormText } from '@ant-design/pro-form';
import ColorPicker from '@/components/ColorPicker';
import { useDrag, useDrop } from 'react-dnd';

const SearchSetting = props => {


  return <>
    <ProFormText name={'placeholder'} label={'提示语'} />
    <ProFormRadio.Group
      name='shape'
      label='形状'
      options={[
        {
          label: 'item 1',
          value: 'circle',
        },
        {
          label: 'item 2',
          value: 'square',
        },
      ]}
    />
    <ProForm.Item name='textColor' label={'文字颜色'}>
      <ColorPicker />
    </ProForm.Item>
    <ProForm.Item name='bgColor' label={'背景颜色'}>
      <ColorPicker />
    </ProForm.Item>

    <ProForm.Item name='inputBgColor' label={'框体颜色'}>
      <ColorPicker />
    </ProForm.Item>
  </>;
};


export default SearchSetting;
