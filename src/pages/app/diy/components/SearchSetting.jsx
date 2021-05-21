import React, { useContext } from 'react';
import ProForm, { ProFormRadio, ProFormText } from '@ant-design/pro-form';
import ColorPicker from '@/components/ColorPicker';
import PaddingGroup from '@/pages/app/diy/components/PaddingGroup';
import MyIcon from '@/components/MyIcon';
import FormContext from '@/pages/app/diy/components/FormContext';

const SearchSetting = props => {


  const form = useContext(FormContext);

  return <>
    <ProFormText name={'placeholder'} label={'提示语'} />
    <ProFormRadio.Group
      name='shape'
      label='框体形状'
      radioType={'button'}
      fieldProps={{buttonStyle:'solid'}}
      options={[
        {
          label: <MyIcon type={'fillet'}/>,
          value: 'round',
        },
        {
          label: <MyIcon type={'square'}/>,
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
    <PaddingGroup/>
  </>;
};


export default SearchSetting;
