import React, { useCallback, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import styles from './MobilePreview.less';
import headerImg from '@/assets/mobile_header.png';
import { useDrop } from 'react-dnd';
import SelectWrapper from '@/pages/shop/diy/components/SelectWrapper';
import DiyContext from '@/pages/shop/diy/DiyContext';

const MobilePreview = ({ pageSettings }) => {

  const { items, setItems, currentItem, setCurrentItem } = useContext(DiyContext);

  const [, drop] = useDrop({
    accept: 'SOURCE',
    drop: () => ({ name: 'preview' }),
  });

  const moveItem = useCallback((dragIndex, hoverIndex) => {
    console.log(dragIndex, hoverIndex);
    if (dragIndex === undefined) {
      const lessIndex = items.findIndex((it) => it.id === -1);
      const newItems = [...items];
      const [placeholderItem] = newItems.splice(lessIndex, 1);
      newItems.splice(hoverIndex, 0, placeholderItem);
      setItems(newItems);
    } else {
      const dragItem = items[dragIndex];
      const newItems = [...items];
      console.log(newItems.map(it=>it.name));
      newItems.splice(dragIndex, 1);
      console.log(newItems.map(it=>it.name));
      newItems.splice(hoverIndex, 0, dragItem);
      console.log(newItems.map(it=>it.name));
      setItems(newItems);
    }
  }, [setItems, items]);


  const isDefaultStyle = useMemo(() => {
    return pageSettings.navStyle === 'default';
  }, [pageSettings.navStyle]);

  const headerStyle = useMemo(() => {
    const style = {
      color: pageSettings.titleColor,
      backgroundImage: `url(${headerImg})`,
      position: isDefaultStyle ? 'unset' : 'absolute',
      zIndex: 2,
    };
    if (isDefaultStyle) {
      style.backgroundColor = pageSettings.navBgColor;
    }

    return style;
  }, [isDefaultStyle, pageSettings.navBgColor, pageSettings.titleColor]);
  const bodyStyle = useMemo(() => {
    return { marginTop: isDefaultStyle ? 63 : 0 };
  }, [isDefaultStyle]);

  const bgStyle = useMemo(() => {
    const style = {
      minHeight: '100%',
      backgroundSize: '100%',
      backgroundRepeat: 'no-repeat',
    };
    if (pageSettings.bgPic.length) {
      style.backgroundImage = `url(${pageSettings.bgPic[0]})`;
    } else {
      style.backgroundColor = pageSettings.bgColor;
    }
    return style;
  }, [pageSettings.bgColor, pageSettings.bgPic]);
  return (
    <div ref={drop} role={'Dustbin'} className={styles.mobile}>
      <div className={styles.header} style={headerStyle}>
        <span>{pageSettings.title}</span>
      </div>
      <div className={styles.body} style={bodyStyle}>
        <div style={bgStyle}>
          {items.map((it, i) => {
            return <SelectWrapper moveItem={moveItem} item={it} index={i} key={it.id} />;
          })}
        </div>
      </div>
    </div>
  );
};

MobilePreview.propTypes = {
  pageSettings: PropTypes.object,
};

export default MobilePreview;
