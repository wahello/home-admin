import React from 'react';
import components from '../components';
import { Col, Row } from 'antd';
import DropItem from './DropItem';

const SourceBox = props => {

  return <Row style={{ width: '100%' }}>
    {
      components.map((it) => {
        return <Col span={8} key={it.key}>
          <DropItem component={it} />
        </Col>;
      })
    }
  </Row>;
};

SourceBox.propTypes = {};

export default SourceBox;
