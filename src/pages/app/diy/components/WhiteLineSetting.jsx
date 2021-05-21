import React from 'react';
import ProForm, { ProFormDigit, ProFormRadio, ProFormSlider } from '@ant-design/pro-form';
import { Space } from 'antd';
import ColorPicker from '@/components/ColorPicker';
import MyIcon from '@/components/MyIcon';

const WhiteLineSetting = props => {
  return (
    <>
      <ProFormRadio.Group
        name='type'
        label='框体形状'
        radioType={'button'}
        fieldProps={{ buttonStyle: 'solid' }}
        options={[
          {
            label: <MyIcon type={'dashed'} />,
            value: 'dashed',
          },
          {
            label: <MyIcon type={'solid'} />,
            value: 'solid',
          },
          {
            label: <MyIcon type={'dot'} />,
            value: 'dotted',
          },
        ]}
      />
      <ProForm.Item name={'color'} label={'线条颜色'}>
        <ColorPicker allowTrans={false} />
      </ProForm.Item>
      <ProForm.Item label={'上下间距'} style={{ marginBottom: 0 }}>
        <Space>
          <ProFormSlider width={150} min={0} max={200} name='padding' fieldProps={{ tooltipVisible: false }}
                         noStyle />
          <ProFormDigit width={75} fieldProps={{ precision: 0 }} min={0} max={200} name='padding' noStyle
                        shouldUpdate />
        </Space>
      </ProForm.Item>
    </>
  );
};


export default WhiteLineSetting;
