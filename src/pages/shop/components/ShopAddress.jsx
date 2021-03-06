import React, { useState } from 'react';
import { Cascader, Input, message, Space } from 'antd';
import areas from '@/utils/area';
import MyMap from '@/components/MyMap';
import { Marker, MouseTool } from 'react-amap';
import { useControllableValue } from 'ahooks';


const ShopAddress = props => {

  const [postion, setPosition] = useControllableValue(props, { defaultValue: {} });

  const [map, setMap] = useState();
  const [geoCoder, setGeoCoder] = useState();
  const [marker, setMarker] = useState();

  const createdMap = ins => {
    setMap(ins);
    AMap.plugin('AMap.Geocoder', () => {
      const coder = new AMap.Geocoder({});
      setGeoCoder(coder);
      if (postion.area) {
        coder.setCity({
          city: postion.area[2],
        });
        coder.getLocation(postion.area.join(), (status, result) => {
          if (status === 'complete' && result.geocodes.length) {
            const { lng, lat } = result.geocodes[0].location;
            ins.setZoomAndCenter(11, [lng, lat]);
          }
        });
      }
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
              setPosition({
                ...postion,
                lat,
                lng,
                address: result.regeocode.formattedAddress.replace(postion.area.join(''), ''),
              });
            }
          });

          break;
        default:
          break;
      }
    },
  };


  const onAddressChange = e => {
    setPosition({
      ...postion,
      address: e.target.value,
    });
  };

  const searchAddress = (v) => {
    const detailAddress = postion?.area?.join('') + v;
    geoCoder.getLocation(detailAddress, (status, result) => {
      if (status === 'complete' && result.geocodes.length) {
        const { lng, lat } = result.geocodes[0].location;
        setPosition({
          ...postion,
          lng,
          lat,
        });
        map.setFitView(marker);
      } else {
        message.error('??????????????????????????????');
      }
    });
  };
  const onAreaChange = e => {
    setPosition({
      ...postion,
      area: e,
    });
    geoCoder.setCity({
      city: e[2],
    });
    geoCoder.getLocation(e.join(), (status, result) => {
      if (status === 'complete' && result.geocodes.length) {
        const { lng, lat } = result.geocodes[0].location;
        map.setZoomAndCenter(11, [lng, lat]);
      }
    });
  };


  return (
    <Space direction={'vertical'}>
      <Space size={'small'}>
        <Cascader value={postion?.area} style={{ width: 215 }} options={areas} onChange={onAreaChange}
                  allowClear={false} />
        <Input.Search value={postion?.address} onChange={onAddressChange} style={{ width: 500 }} enterButton={'????????????'}
                      onSearch={searchAddress} placeholder={'????????????'} />
      </Space>
      <div style={{ width: 800, height: 400 }}>
        <MyMap zoom={12} events={{ created: createdMap }}
               center={{ longitude: postion?.lng || 0, latitude: postion?.lat || 0 }}>
          <MouseTool events={toolEvents} />
          <Marker events={{ created: setMarker }}
                  position={{ longitude: postion?.lng || 0, latitude: postion?.lat || 0 }} />
        </MyMap>
      </div>
    </Space>
  );
};


export default ShopAddress;
