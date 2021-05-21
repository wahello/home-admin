import React from 'react';
import ProForm, { ProFormRadio } from '@ant-design/pro-form';
import PaddingGroup from '@/pages/app/diy/components/PaddingGroup';
import MyIcon from '@/components/MyIcon';
import LinkSelect from '@/pages/app/diy/components/LinkSelect';

const SearchSetting = props => {

  return <>
    <ProForm.Group title={'基本设置'} collapsible>
      <ProFormRadio.Group
        name='shape'
        label='图片形状'
        radioType={'button'}
        fieldProps={{ buttonStyle: 'solid' }}
        options={[
          {
            label: <MyIcon type={'fillet'} />,
            value: 'round',
          },
          {
            label: <MyIcon type={'square'} />,
            value: 'square',
          },
        ]}
      />
      <br />
      <ProForm.Item name={'pics'} label={'轮播图片'}>
        <LinkSelect max={9} canDelete />
      </ProForm.Item>

    </ProForm.Group>

    <PaddingGroup />
  </>;
};


export default SearchSetting;
