import React from 'react';
import errorImg from '@/assets/error-image.png';
import styles from './Navs.less';


const Navs = ({ settings }) => {
  const { columns, pics, ...extraStyle } = settings;
  return (
    <div className={styles.wrapper} style={extraStyle}>
      {
        pics.map((pic, idx) => {
          return <div className={styles.item} style={{ width: `calc(100% / ${columns})` }} key={idx.toString()}>
            <img src={pic.pic || errorImg} className={styles.image} />
            {pic.title&&<span className={styles.title}>{pic.title}</span>}
          </div>;
        })
      }
    </div>
  );
};

Navs.propTypes = {};

export default Navs;
