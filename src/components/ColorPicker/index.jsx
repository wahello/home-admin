import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useBoolean } from 'ahooks';
import { ChromePicker } from 'react-color';
import styles from './index.less';
import { Button, Popover, Space } from 'antd';
import transImg from '@/assets/trans.png';

const reg = /rgba\((.*),(.*),(.*),(.*)\)/;
const ColorPicker = props => {
  const changeColor = e => {
    const { r, g, b, a } = e.rgb;
    props.onChange?.(`rgba(${r},${g},${b},${a})`);
  };
  const setTrans = () => {
    props.onChange?.('rgba(0,0,0,0)');
  };

  const rgba = useMemo(() => {
    if (props.value) {
      const [_, r, g, b, a] = reg.exec(props.value);
      return { r: Number(r), g: Number(g), b: Number(b), a: Number(a) };
    }
    return null;
  }, [props.value]);

  const [show, toggleShow] = useBoolean(false);
  return (
    <Space size={'small'}>
      <Popover visible={show} overlayClassName={styles.popover} trigger={'click'} onVisibleChange={toggleShow.toggle}
               content={<ChromePicker color={rgba} onChange={changeColor} />}>

        <div className={styles.swatch} style={{ background: rgba?.a === 0 ? `url("${transImg}")` : props.value }}>
          <div className={styles.color} />
        </div>
      </Popover>
      {props.allowTrans&&<Button size={'small'} onClick={setTrans} type={'link'}>透明</Button>}
    </Space>

  );
};

ColorPicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  allowTrans:PropTypes.bool
};
ColorPicker.defaultProps={
  allowTrans:true
}

export default ColorPicker;
