import React from 'react';
import PropTypes from 'prop-types';
import { Carousel } from 'antd';
import errorImg from '@/assets/error-image.png';


const Swiper = ({ settings }) => {

  const { shape, pics, ...extraStyle } = settings;
  const imgStyle = {
    borderRadius: shape === 'square' ? 0 : 20,
    width: '100%',
    height: 350,
    objectFit:'cover'
  };
  console.log(pics);
  return (
    <div style={{ ...extraStyle }}>
      <Carousel>
        {
          pics.length ? pics.map((it, idx) => {
            return <div key={idx.toString()}><img draggable={false} style={imgStyle} src={it.pic||errorImg} /></div>;
          }) : <div><img draggable={false} src={errorImg} style={imgStyle} />
          </div>}
      </Carousel>
    </div>
  );
};

Swiper.propTypes = {
  settings: PropTypes.object,
};

export default Swiper;
