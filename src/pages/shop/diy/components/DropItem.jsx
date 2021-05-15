import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styles from './DropItem.less';
import { useDrag } from 'react-dnd';
import uuid from 'uuid';
import DiyContext from '@/pages/shop/diy/DiyContext';



const DropItem = ({ component }) => {
  const {  setCurrentItem, mpSetting, setMpSetting } = useContext(DiyContext);

  const [, drag] = useDrag({
    type: 'SOURCE',
    item() {
      const useless = mpSetting.components.find((item) => item.id === -1);
      if (!useless) {
        setMpSetting({
          ...mpSetting,
          components: [
            ...mpSetting.components,
            {
              id: -1,
              settings: component.defaultSetting,
              key: component.key,
            },
          ],
        });
      }
      return component;
    },
    end(item, monitor) {
      const uselessIndex = mpSetting.components.findIndex((it) => it.id === -1);
      const newMpSetting = { ...mpSetting };
      if (monitor.didDrop()) {
        const newComp = {
          id: uuid(),
          settings: component.defaultSetting,
          key: component.key,
        };
        newMpSetting.components.splice(uselessIndex, 1, newComp);
        setCurrentItem(newComp);
        setMpSetting(newMpSetting);
      } else {
        newMpSetting.components.splice(uselessIndex, 1);
        setMpSetting(newMpSetting);
      }
    },
  });

  return <div ref={drag} role={'box'} className={styles.itemBox}>
    <div className={styles.icon}>{component.icon}</div>
    <p>{component.name}</p>
  </div>;
};

DropItem.propTypes = {
  component: PropTypes.object,
};

export default DropItem;
