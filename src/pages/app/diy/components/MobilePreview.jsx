import React, { useCallback, useContext, useMemo } from 'react';
import styles from './MobilePreview.less';
import headerImg from '@/assets/mobile_header.png';
import { useDrop } from 'react-dnd';
import SelectWrapper from '@/pages/app/diy/components/SelectWrapper';
import DiyContext from '@/pages/app/diy/DiyContext';

const MobilePreview = () => {

  const { mpSetting, setMpSetting } = useContext(DiyContext);

  const [, drop] = useDrop({
    accept: 'SOURCE',
    drop: () => ({ name: 'preview' }),
  });

  const moveItem = useCallback((dragIndex, hoverIndex) => {
    const newMpSetting = { ...mpSetting };
    if (dragIndex === undefined) {
      const lessIndex = newMpSetting.components.findIndex((it) => it.id === -1);
      const [placeholderItem] = newMpSetting.components.splice(lessIndex, 1);
      newMpSetting.components.splice(hoverIndex, 0, placeholderItem);
      setMpSetting(newMpSetting);
    } else {
      const dragItem = newMpSetting.components[dragIndex];
      newMpSetting.components.splice(dragIndex, 1);
      newMpSetting.components.splice(hoverIndex, 0, dragItem);
    }
    setMpSetting(newMpSetting);
  }, [mpSetting, setMpSetting]);


  const pageSettings = useMemo(() => {
    return mpSetting.page;
  }, [mpSetting]);

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
    return {
      marginTop: isDefaultStyle ? 126 : 0,
      padding: `0 ${pageSettings.padding}px`,
      height: isDefaultStyle ? 1206 : 1334,
      backgroundColor: pageSettings.bgColor,
    };
  }, [isDefaultStyle, pageSettings.bgColor, pageSettings.padding]);

  const bgStyle = useMemo(() => {
    const style = {
      backgroundSize: '100%',
      backgroundRepeat: 'no-repeat',
    };
    if (pageSettings.bgPic) {
      style.backgroundImage = `url(${pageSettings.bgPic})`;
      style.backgroundColor = '#F8F8F8';
    }
    return style;
  }, [pageSettings.bgPic]);

  return (
    <div ref={drop} className={styles.mobile}>
      <div className={styles.header} style={headerStyle}>
        <span>{pageSettings.title}</span>
      </div>
      <div className={styles.body} style={{ ...bodyStyle }}>
        <div style={{ ...bgStyle, height: '100%' }}>
          {
            mpSetting.components.map((it, i) => {
              return <SelectWrapper moveItem={moveItem} item={it} index={i} key={it.id} />;
            })
          }
        </div>
      </div>
    </div>
  );
};


export default MobilePreview;
