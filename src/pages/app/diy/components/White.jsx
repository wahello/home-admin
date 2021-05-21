import React from 'react';
import PropTypes from 'prop-types';

const White = props => {
  const { settings } = props;
  return (
    <div style={{ width: '100%', height: settings.height, background: settings.color }}>

    </div>
  );
};

White.propTypes = {
  settings: PropTypes.object,
};

export default White;
