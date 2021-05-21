import React from 'react';
import PropTypes from 'prop-types';

const WhiteLine = ({ settings }) => {
  const { type,padding,color } = settings;

  return <div style={{ width:'100%',height: 50 + padding, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{width:'100%',borderColor:color,borderWidth:2,borderStyle:type}}/>
  </div>;
};

WhiteLine.propTypes = {
  settings: PropTypes.object,
};

export default WhiteLine;
