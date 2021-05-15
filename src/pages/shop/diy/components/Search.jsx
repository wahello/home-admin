import React from 'react';
import PropTypes from 'prop-types';
import styles from './Search.less';
import { SearchOutlined } from '@ant-design/icons';


const Search = ({ settings }) => {

  const { shape, bgColor, textColor, inputBgColor, ...extraStyle } = settings;
  const borderRadius = shape === 'square' ? 5 : 50;
  return (
    <div className={styles.wrapper}
         style={{ backgroundColor: settings.bgColor, color: settings.textColor, ...extraStyle }}>
      <div className={styles.search} style={{
        borderRadius,
        backgroundColor: settings.inputBgColor,
      }}>
        <SearchOutlined className={styles.icon} />
        <input value={settings.placeholder} readOnly />
      </div>
    </div>
  );
};

Search.propTypes = {
  settings: PropTypes.object,
};

export default Search;
