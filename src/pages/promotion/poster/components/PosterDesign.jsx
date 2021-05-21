import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import qrCodeImg from '@/assets/qrcode.svg';
import Moveable from 'react-moveable';
import { Button, Modal } from 'antd';
import { useBoolean } from 'ahooks';
import defaultImg from '@/assets/error-image.png';


const originSize = 600;
const PosterDesign = props => {

  const [visible, toggleVisible] = useBoolean(false);
  const posterRef = useRef();
  const moveableRef = useRef();
  const [imgSize, setImgSize] = useState({
    naturalWidth: originSize,
    naturalHeight: originSize,
    clientWidth: originSize,
    clientHeight: originSize,
  });
  const [loaded, setLoaded] = useState(false);

  const [qrCodeSize, setQrCodeSize] = useState(100);
  const [radio, setRadio] = useState(1);
  const [qrCodePosition, setQrCodePosition] = useState({
    top: 0,
    left: 0,
  });
  const [target, setTarget] = useState();
  const [frame, setFrame] = useState({
    translate: [0, 0],
  });


  const onImgLoad = () => {
    const { naturalWidth, naturalHeight, clientWidth, clientHeight } = posterRef?.current;
    setImgSize({
      naturalWidth,
      naturalHeight,
      clientWidth,
      clientHeight,
    });
    setRadio(naturalWidth / clientWidth);
    setLoaded(true);
  };


  useEffect(() => {
    if (props.value && loaded) {
      const { top, left, size } = props.value;
      setQrCodePosition({
        top: top / radio,
        left: left / radio,
      });
      console.log(radio);
      setQrCodeSize(size / radio);
      const doc = document.querySelector('#qrcode');
      if (doc) {
        doc.style.transform = `translate(${left / radio}px, ${top / radio}px)`;
        frame.translate = [left / radio, top / radio];
        doc.style.width = `${size / radio}px`;
        doc.style.height = `${size / radio}px`;
        moveableRef.current?.updateTarget();
      }
    }
  }, [loaded, props.value, radio]);

  useEffect(() => {
    if (visible && !props.readonly) {
      setTarget(document.querySelector('#qrcode'));
    }
  }, [visible, props.readonly]);
  const onDragEnd = e => {
    const { top, left } = e.currentTarget.state;
    setQrCodePosition({
      top, left,
    });
  };
  const onOk = () => {
    props.onChange({
      top: radio * qrCodePosition.top,
      left: radio * qrCodePosition.left,
      size: qrCodeSize * radio,
    });
    toggleVisible.setFalse();
  };
  return (
    <>
      <Modal style={{ top: 10 }} title={false} closeIcon={false} width={600} visible={visible} onCancel={toggleVisible.setFalse} onOk={onOk}
             bodyStyle={{ padding: 0 }}>
        <div style={{ width: originSize, position: 'relative' }}>
          <img onLoad={onImgLoad} ref={posterRef} style={{ width: '100%' }}
               src={props.image || defaultImg} />
          <div
               id={'qrcode'}
               style={{
                 color: '#FFF',
                 background: 'rgba(0,0,0,.5)',
                 width: qrCodeSize,
                 height: qrCodeSize,
                 position: 'absolute',
                 top: 0,
                 left: 0,
                 borderRadius: '50%',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 fontSize:20
               }}
          >二维码<br/>占位符</div>
        </div>
        <Moveable
          ref={moveableRef}
          target={target}
          bounds={{ left: 0, top: 0, right: imgSize.clientWidth, bottom: imgSize.clientHeight }}
          throttleDrag={0}
          startDragRotate={0}
          throttleDragRotate={0}
          zoom={1}
          renderDirections={['nw', 'ne', 'se', 'sw']}
          onDragStart={e => {
            e.set(frame.translate);
          }}
          onResizeStart={e => {
            e.setOrigin(['%', '%']);
            if (e.dragStart) {
              e.dragStart.set(frame.translate);
            }
          }}
          onResize={e => {
            const { beforeTranslate } = e.drag;
            frame.translate = beforeTranslate;
            setQrCodeSize(e.width < 100 ? 100 : e.width);
            e.target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
          }}
          onDrag={e => {
            frame.translate = e.beforeTranslate;
            e.target.style.transform = `translate(${e.beforeTranslate[0]}px, ${e.beforeTranslate[1]}px)`;
          }}
          onDragEnd={onDragEnd}
          draggable
          resizable
          snappable
          origin
        />
      </Modal>
      <Button type={'primary'} onClick={toggleVisible.setTrue}>设计海报</Button>
    </>
  );

};

PosterDesign.propTypes = {
  image: PropTypes.string,
  value: PropTypes.object,
  onChange: PropTypes.func,
  readonly: PropTypes.bool,
};
PosterDesign.defaultProps = {
  readonly: false,
};

export default PosterDesign;
