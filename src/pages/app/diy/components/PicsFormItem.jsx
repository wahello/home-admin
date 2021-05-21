import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import LinkSelect from '@/pages/app/diy/components/LinkSelect';
import DiyContext from '@/pages/app/diy/DiyContext';

const PicsFormItem = ({value, onChange }) => {
  const { currentItem } = useContext(DiyContext);
  useEffect(() => {
    let picSize = 1;
    switch (currentItem.settings.type) {
      case 'one-one':
        picSize = 1;
        break;
      case 'one-two':
        picSize = 2;
        break;
      case 'one-three':
        picSize = 3;
        break;
      case 'one-four':
        picSize = 4;
        break;
      case 'two-three':
        picSize = 3;
        break;
      case 'two-four':
        picSize = 4;
        break;
      default:
        break;
    }

    const pics = [...currentItem.settings.pics];
    const fillLen = picSize - pics.length;
    if (fillLen < 0) {
      pics.splice(picSize);
    } else {
      for (let i = 0; i < fillLen; i++) {
        pics.push({
          pic: null,
          page:null,
        });
      }
    }
    onChange(pics);
  }, [currentItem.settings.type]);


  return  <LinkSelect value={value} onChange={onChange} />

};

PicsFormItem.propTypes = {
  type: PropTypes.string,
};

export default PicsFormItem;
