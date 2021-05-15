import React from 'react';
import ProForm, { ProFormList, ProFormRadio } from '@ant-design/pro-form';
import PaddingGroup from '@/pages/shop/diy/components/PaddingGroup';
import MyIcon from '@/components/MyIcon';
import LinkSelect from '@/pages/shop/diy/components/LinkSelect';
import { Button, Form } from 'antd';

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
        <LinkSelect max={9} />
      </ProForm.Item>

    </ProForm.Group>

    <PaddingGroup />
  </>;
};


export default SearchSetting;
