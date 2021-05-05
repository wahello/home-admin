import React from 'react';
import ProForm, { ProFormRadio, ProFormText } from '@ant-design/pro-form';
import ColorPicker from '@/components/ColorPicker';

const SearchSetting = props => {

  return <>
    <ProFormText name={'placeholder'} label={'提示语'} />
    <ProFormRadio.Group
      name="shape"
      label="形状"
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
  </>;
};



export default SearchSetting;
