import React from 'react';
import PropTypes from 'prop-types';
import ProCard from '@ant-design/pro-card';
import { Checkbox, Image } from 'antd';
import errorImage from '@/assets/error-image.png';
import styles from './MaterialImage.less';
import classNames from 'classnames';

const MaterialImage = props => {
  const checkImage = () => {
    props.onChange(props.fileUrl);
  };
  return (
    <ProCard>
      <div className={styles.wrapper} onClick={checkImage}>
        <Image width={120} height={120} className={classNames(styles.img, props.checked && styles.selected)}
               src={props.fileUrl} fallback={errorImage}
               preview={false} />
        <Checkbox className={styles.checkbox} checked={props.checked} onChange={checkImage} />
      </div>
    </ProCard>
  );
};

MaterialImage.propTypes = {
  fileUrl: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  size: PropTypes.number,
};

export default MaterialImage;
