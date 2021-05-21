import React from 'react';
import PropTypes from 'prop-types';
import ProForm, { ProFormDigit, ProFormSlider } from '@ant-design/pro-form';
import { Space } from 'antd';

const PaddingGroup = props => {
  return (
    <ProForm.Group title={'内部距离'} direction={'vertical'} collapsible>
      <ProForm.Item label={'左'} style={{ marginBottom: 0 }}>
        <Space>
          <ProFormSlider width={150} min={0} max={props.max} name='paddingLeft' fieldProps={{ tooltipVisible: false }}
                         noStyle />
          <ProFormDigit width={75} fieldProps={{ precision: 0 }} min={0} max={200} name='paddingLeft' noStyle
                        shouldUpdate />
        </Space>
      </ProForm.Item>
      <ProForm.Item label={'右'} style={{ marginBottom: 0 }}>
        <Space>
          <ProFormSlider width={150} min={0} max={props.max} name='paddingRight' fieldProps={{ tooltipVisible: false }}
                         noStyle />
          <ProFormDigit width={75} fieldProps={{ precision: 0 }} min={0} max={200} name='paddingRight' noStyle
                        shouldUpdate />
        </Space>
      </ProForm.Item>
      <ProForm.Item label={'上'} style={{ marginBottom: 0 }}>
        <Space>
          <ProFormSlider width={150} min={0} max={props.max} name='paddingTop' fieldProps={{ tooltipVisible: false }}
                         noStyle />
          <ProFormDigit width={75} fieldProps={{ precision: 0 }} min={0} max={200} name='paddingTop' noStyle
                        shouldUpdate />
        </Space>
      </ProForm.Item>
      <ProForm.Item label={'下'} style={{ marginBottom: 0 }}>
        <Space>
          <ProFormSlider width={150} min={0} max={props.max} name='paddingBottom' fieldProps={{ tooltipVisible: false }}
                         noStyle />
          <ProFormDigit width={75} fieldProps={{ precision: 0 }} min={0} max={200} name='paddingBottom' noStyle
                        shouldUpdate />
        </Space>
      </ProForm.Item>
    </ProForm.Group>
  );
};

PaddingGroup.propTypes = {
  max: PropTypes.number,
};
PaddingGroup.defaultProps = {
  max: 200,
};

export default PaddingGroup;
