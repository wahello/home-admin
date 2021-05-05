import React from 'react';
import PropTypes from 'prop-types';
import styles from './component.less';
import { Carousel, Image } from 'antd';


const Swiper = ({ settings }) => {

  const imgStyle={
    borderRadius: settings.shape === 'square' ? 0 : 10,
    width: '100%',
    height:175
  }
  return (
    <div className={styles.wrapper}>
      <Carousel>
        {
          settings.pics.length?settings.pics.map((it,idx) => {
            return <div key={idx.toString()}><img  draggable={false} style={imgStyle} src={it.pic}    /></div>;
          }):<div><span>选择您的图片</span></div>
        }
      </Carousel>
    </div>
  );
};

Swiper.propTypes = {
  settings: PropTypes.object,
};

export default Swiper;
