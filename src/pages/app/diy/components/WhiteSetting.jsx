import React from 'react';
import ProForm, { ProFormDigit, ProFormSlider } from '@ant-design/pro-form';
import { Space } from 'antd';
import ColorPicker from '@/components/ColorPicker';

const WhiteSetting = props => {
  return (
    <>
      <ProForm.Item label={'留白高度'} style={{ marginBottom: 0 }}>
        <Space>
          <ProFormSlider width={150} min={0} max={400} name='height' fieldProps={{ tooltipVisible: false }}
                         noStyle />
          <ProFormDigit width={75} fieldProps={{ precision: 0 }} min={0} max={400} name='height' noStyle
                        shouldUpdate />
        </Space>
      </ProForm.Item>
      <ProForm.Item name={'color'} label={'颜色'} >
       <ColorPicker/>
      </ProForm.Item>
    </>
  );
};


export default WhiteSetting;
