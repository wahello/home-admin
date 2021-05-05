import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styles from './DropItem.less';
import { useDrag } from 'react-dnd';
import uuid from 'uuid';
import DiyContext from '@/pages/shop/diy/DiyContext';

const DropPlaceHolder = <div className={styles.dropPlaceHolder}>放这里</div>;

const DropItem = ({ component }) => {
  const { items, setItems } = useContext(DiyContext);

  const [, drag] = useDrag({
    type: 'SOURCE',
    item() {
      const useless = items.find((item) => item.id === -1);
      if (!useless) {
        setItems([{
          ...component,
          id: -1,
          settings: component.defaultSetting
          // component: DropPlaceHolder,
        }, ...items]);
      }
      return component;
    },
    end(item, monitor) {
      const uselessIndex = items.findIndex((it) => it.id === -1);
      console.log(monitor.getDropResult(), monitor.didDrop());
      const newItems = [...items];
      if (monitor.didDrop()) {
        newItems.splice(uselessIndex, 1, { ...item, settings: component.defaultSetting, id: uuid() });
      } else {
        newItems.splice(uselessIndex, 1);
      }
      console.log(newItems);
      setItems(newItems);
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
