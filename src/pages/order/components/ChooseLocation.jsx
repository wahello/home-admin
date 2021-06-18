import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useBoolean } from 'ahooks';
import { Button, Modal } from 'antd';
import MyMap from '@/components/MyMap';
import { InfoWindow, Marker, MouseTool } from 'react-amap';

const ChooseLocation = props => {
  const [geo, setGeo] = useState();
  const [map, setMap] = useState();
  const [geoCoder, setGeoCoder] = useState();
  const [show, toggleShow] = useBoolean(false);
  const [marker, setMarker] = useState();
  const [location, setLocation] = useState();
  useEffect(() => {
    setLocation(props.location);
  }, [props.location]);

  useEffect(() => {
    setGeo(props.value);
  }, [props.value]);

  const createdMap = ins => {
    setMap(ins);
    AMap.plugin('AMap.Geocoder', () => {
      setGeoCoder(new AMap.Geocoder({
        extensions: 'all',
      }));
    });
  };
  const toolEvents = {
    created: initTool => {
      initTool.marker({ visible: false });
    },
    draw({ obj }) {
      switch (obj.CLASS_NAME) {
        case 'AMap.Marker':
          geoCoder.getAddress(obj.getPosition(), (status, result) => {
            if (status === 'complete' && result.info === 'OK') {
              const { lng, lat } = obj.getPosition();
              console.log(result.regeocode);
              setLocation(result.regeocode.pois[0].name);
              setGeo({
                lat, lng,
              });
            }
          });

          break;
        default:
          break;
      }
    },
  };

  const onOk = () => {
    props.onChange(geo);
    props.changeLocation(location);
    toggleShow.setFalse();
  };
  return (
    <>
      <Modal visible={show} title={'地图选址'} width={600} onCancel={toggleShow.setFalse} onOk={onOk}>
        <div style={{ width: '100%', height: 500, margin: 'auto', position: 'relative' }}>
          <MyMap events={{ created: createdMap }} zoom={18}
                 center={{ longitude: geo?.lng || 0, latitude: geo?.lat || 0 }}>
            <MouseTool events={toolEvents} />
            <Marker events={{ created: setMarker }}
                    position={{ longitude: geo?.lng || 0, latitude: geo?.lat || 0 }}>
              <div style={{
                width: 16,
                height: 16,
                backgroundColor: '#0f89f5',
                border: '2px solid #FFF',
                borderRadius: '50%',
              }} />

            </Marker>
            <InfoWindow offset={[0, -40]} position={{ longitude: geo?.lng || 0, latitude: geo?.lat || 0 }} visible
                        closeWhenClickMap={false}>
              <div>{location}</div>
            </InfoWindow>
          </MyMap>
        </div>
      </Modal>
      <Button style={{ marginLeft: 10 }} type={'primary'} onClick={toggleShow.setTrue}>地图选址</Button>
    </>
  );
};

ChooseLocation.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func,
  changeLocation: PropTypes.func,
  location: PropTypes.string,
};

export default ChooseLocation;
