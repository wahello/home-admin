import React from 'react';
import components from '../components';
import { Col, Row } from 'antd';
import DropItem from './DropItem';
import ProCard from '@ant-design/pro-card';

const SourceBox = props => {

  return <div style={{ width: '100%' }}>
    <ProCard title={'基础组件'} collapsible defaultCollapsed={false} ghost>
      <div style={{display:'flex',flexWrap:'wrap'}}>
        {
          components.filter(it=>it.category==='base').map((it) => {
            return <Col span={8} key={it.key}>
              <DropItem component={it} />
            </Col>;
          })
        }
      </div>
    </ProCard>
    <ProCard title={'营销组件'} collapsible defaultCollapsed={false} ghost>
      <div style={{display:'flex',flexWrap:'wrap'}}>
        {
          components.filter(it=>it.category==='promotion').map((it) => {
            return <Col span={8} key={it.key}>
              <DropItem component={it} />
            </Col>;
          })
        }
      </div>
    </ProCard>
    <ProCard title={'辅助组件'} collapsible defaultCollapsed={false} ghost>
      <div style={{display:'flex',flexWrap:'wrap'}}>
        {
          components.filter(it=>it.category==='help').map((it) => {
            return <Col span={8} key={it.key}>
              <DropItem component={it} />
            </Col>;
          })
        }
      </div>
    </ProCard>
  </div>;
};

SourceBox.propTypes = {};

export default SourceBox;
