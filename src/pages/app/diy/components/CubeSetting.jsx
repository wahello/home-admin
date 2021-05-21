import React from 'react';
import ProForm, { ProFormDependency, ProFormRadio } from '@ant-design/pro-form';
import MyIcon from '@/components/MyIcon';
import PicsFormItem from '@/pages/app/diy/components/PicsFormItem';
import PaddingGroup from '@/pages/app/diy/components/PaddingGroup';


const CubeSetting = props => {



  return <ProForm.Item>
    <ProFormRadio.Group
      name='type'
      label='框体形状'
      radioType={'button'}
      fieldProps={{ buttonStyle: 'solid' }}
      options={[
        {
          label: <MyIcon type={'one-one'} />,
          value: 'one-one',
        },
        {
          label: <MyIcon type={'one-two'} />,
          value: 'one-two',
        },
        {
          label: <MyIcon type={'one-three'} />,
          value: 'one-three',
        },
        {
          label: <MyIcon type={'two-one'} />,
          value: 'two-three',
        },
        {
          label: <MyIcon type={'one-four'} />,
          value: 'one-four',
        },
        {
          label: <MyIcon type={'two-two'} />,
          value: 'two-four',
        },
      ]}
    />
    <ProFormDependency name={['type']}>
      {({ type }) => {
        return <ProForm.Item name={'pics'} label={'图片链接'}><PicsFormItem type={type} /></ProForm.Item>
      }}
    </ProFormDependency>
  </ProForm.Item>
};

export default CubeSetting;
