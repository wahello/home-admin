import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useBoolean } from 'ahooks';
import { ChromePicker  } from 'react-color';
import styles from './index.less';


const ColorPicker = props => {
  const changeColor = e => {
    props.onChange?.(e.hex);
  };
  const [show, toggleShow] = useBoolean(false);
  return (
    <>
      <div className={styles.swatch} style={{background:props.value}} onClick={toggleShow.setTrue}>
        <div className={styles.color} />
      </div>
      { show ? <div className={ styles.popover }>
        <div className={ styles.cover } onClick={ toggleShow.setFalse }/>
        <ChromePicker color={ props.value } onChange={ changeColor } />
      </div> : null }
    </>
  );
};

ColorPicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default ColorPicker;
