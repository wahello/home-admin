import React from 'react';
import PropTypes from 'prop-types';
import styles from './component.less';
import { SearchOutlined } from '@ant-design/icons';


const Search = ({ settings }) => {

  const borderRadius = settings.shape === 'square' ? 5 : 50;
  return (
    <div className={styles.wrapper} style={{ backgroundColor: settings.bgColor, color: settings.textColor }}>
      <div className={styles.search}>
        <SearchOutlined className={styles.icon} />
        <input  style={{
          borderRadius,
          backgroundColor: settings.inputBgColor,
        }} value={settings.placeholder} readOnly />
      </div>
    </div>
  );
};

Search.propTypes = {
  settings: PropTypes.object,
};

export default Search;
