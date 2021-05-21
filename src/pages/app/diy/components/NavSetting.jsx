import React from 'react';
import ProForm, { ProFormRadio } from '@ant-design/pro-form';
import PaddingGroup from '@/pages/app/diy/components/PaddingGroup';
import LinkSelect from '@/pages/app/diy/components/LinkSelect';


const NavsSetting = props => {

  return <>
    <ProForm.Group title={'基本设置'} collapsible>
      <ProFormRadio.Group
        name='columns'
        label='每行数量'
        radioType={'button'}
        fieldProps={{ buttonStyle: 'solid' }}
        options={[
          {
            label: 3,
            value: 3,
          },
          {
            label: 4,
            value: 4,
          },
          {
            label: 5,
            value: 5,
          },
        ]}
      />
      <br />
      <ProForm.Item name={'pics'} label={'导航'}>
        <LinkSelect title canDelete />
      </ProForm.Item>

    </ProForm.Group>

    <PaddingGroup />
  </>;
};


export default NavsSetting;
