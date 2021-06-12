import React from 'react';
import PropTypes from 'prop-types';

import errorImg from '@/assets/error-image.png';
import styles from './Cube.less';

const Cube = ({ settings }) => {
  const { type, pics,...extraStyle } = settings;
  console.log(extraStyle);
  return (
    <div className={styles[`cube_${type}`]} style={extraStyle}>
      {pics?.map((pic, idx) => <img className={styles.cubeImg} src={pic.pic || errorImg} key={`${idx}`} />)}
    </div>
  );
};

Cube.propTypes = {
  settings: PropTypes.object,
};

export default Cube;
