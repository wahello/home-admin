import React, { useContext, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './SelectWrapper.less';
import classNames from 'classnames';
import { useDebounceFn, useHover } from 'ahooks';
import { Tag } from 'antd';
import { useDrag, useDrop } from 'react-dnd';
import DiyContext from '@/pages/shop/diy/DiyContext';

const SelectWrapper = props => {
  const ref = useRef();
  const isHovering = useHover(ref);

  const { items, setItems, currentItem, setCurrentItem } = useContext(DiyContext);
  const { run } = useDebounceFn(
    (item, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = props.index;

      // 拖拽元素下标与鼠标悬浮元素下标一致时，不进行操作
      if (dragIndex === hoverIndex) {
        return;
      }

      // 确定屏幕上矩形范围
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // 获取中点垂直坐标
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // 确定鼠标位置
      const clientOffset = monitor.getClientOffset();

      // 获取距顶部距离
      const hoverClientY = clientOffset?.y - hoverBoundingRect.top;


      // 向下拖动
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // 向上拖动
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // 执行 move 回调函数
      props.moveItem(dragIndex, hoverIndex);

      /**
       * 如果拖拽的组件为 Box，则 dragIndex 为 undefined，此时不对 item 的 index 进行修改
       * 如果拖拽的组件为 Card，则将 hoverIndex 赋值给 item 的 index 属性
       */
      if (item.index !== undefined) {
        // eslint-disable-next-line no-param-reassign
        item.index = hoverIndex;
      }

    },
    {
      wait: 10,
    },
  );


  const [{ isDragging }, drag] = useDrag({
    type: 'SOURCE',
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    item: { ...props.item, index: props.index },
  });

  const [, drop] = useDrop({
    accept: 'SOURCE',
    hover: run,
  });

  drag(drop(ref));

  const onRemove = () => {
    const idx = items.findIndex(it => it.id === props.item.id);
    const newItems = [...items];
    newItems.splice(idx, 1);
    setItems(newItems);
    if (currentItem?.id === props.item.id) {
      setCurrentItem(null);
    }
  };

  const checked = useMemo(() => {
    return props.item.id === currentItem?.id;
  }, [currentItem?.id, props.item.id]);

  const onCheck = () => setCurrentItem(props.item);
  return (
    <div ref={ref} onClick={onCheck}
         className={classNames(styles.wrapper, (isHovering || checked) && styles.checked)}
         style={{ opacity: isDragging ? 0 : 1 }}>
      {React.cloneElement(props.item.component, { settings: props.item.settings })}
      {(isHovering || checked) && <Tag className={styles.delete} onClick={onRemove}>删除</Tag>}
    </div>
  );
};

SelectWrapper.propTypes = {
  index: PropTypes.number,
  item: PropTypes.object,
  moveItem: PropTypes.func,
};

export default SelectWrapper;
