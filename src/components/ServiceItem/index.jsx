import styles from '@/pages/order/index.less';
import { Image } from 'antd';
import React from 'react';

const ServiceItem = ({ service, sku }) => {
  return <div className={styles.service}>
    <Image width={60} height={60} src={service.mainPic} />
    <div className={styles.info}>
      <div>
        <b>{service.name}</b>
        <b style={{ color: '#fa3534' }}>￥{sku.price}</b>
      </div>
      <div>
        <span>{sku.name}</span>
        <span>{sku.num}{sku.unit}</span>
      </div>
    </div>
  </div>;
};

export default ServiceItem;
