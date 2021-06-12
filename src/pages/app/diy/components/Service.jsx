import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styles from './Service.less';
import goodImg from '@/assets/good_bg.png';

const Service = ({ settings }) => {
  const { type, dataType,themeColor,btnColor,btnText, ...extraStyle } = settings;

  const renderItem = useMemo(() => {
      switch (type) {
        case 1:
          return <div className={styles.service1}>
            <img src={goodImg} className={styles.serviceImg} />
            <div className={styles.mask}>
              <div className={styles.sales}>已服务392次</div>
            </div>
            <div className={styles.serviceBody}>
              <div className={styles.serviceName}>服务名称</div>
              <div className={styles.priceWrapper}>
                <div className={styles.price}>￥120</div>
                <div className={styles.linePrice}>￥240</div>
              </div>
              <div className={styles.footer}>
                <div className={styles.tags}>
                  <div className={styles.tag} style={{borderColor:themeColor,color:themeColor}}>专业工具</div>
                  <div className={styles.tag} style={{borderColor:themeColor,color:themeColor}}>全拆清洗</div>
                </div>
                <div className={styles.btn} style={{background:themeColor,color:btnColor}}>{btnText}</div>
              </div>
            </div>
          </div>;
        case 2:
          return <div className={styles.service2}>
            <img src={goodImg} className={styles.serviceImg} />
            <div className={styles.serviceBody}>
              <div className={styles.serviceName}>服务名称</div>
              <div className={styles.tags}>
                <div className={styles.tag} style={{borderColor:themeColor,color:themeColor}}>专业工具</div>
                <div className={styles.tag} style={{borderColor:themeColor,color:themeColor}}>全拆清洗</div>
              </div>
              <div className={styles.footer}>
                <div>
                  <div className={styles.price}>￥120</div>
                  <div className={styles.linePrice}>￥240</div>
                </div>
                <div>
                  <div className={styles.sales}>已服务3129次</div>
                  <div className={styles.btn} style={{background:themeColor,color:btnColor}}>{btnText}</div>
                </div>
              </div>
            </div>
          </div>;
        case 3:
          return <div className={styles.service3}>
            <img src={goodImg} className={styles.serviceImg} />
            <div className={styles.mask}>
              <div className={styles.sales}>已服务3129次</div>
            </div>
            <div className={styles.serviceBody}>
              <div className={styles.serviceName}>服务名称</div>
              <div className={styles.tags}>
                <div className={styles.tag} style={{borderColor:themeColor,color:themeColor}}>专业工具</div>
                <div className={styles.tag} style={{borderColor:themeColor,color:themeColor}}>全拆清洗</div>
              </div>
            </div>
            <div className={styles.footer}>
              <div className={styles.priceWrapper}>
                <div className={styles.price}>￥120</div>
                <div className={styles.linePrice}>￥240</div>
              </div>
              <div className={styles.btn} style={{background:themeColor,color:btnColor}}>{btnText}</div>
            </div>
          </div>;
        default:
          return null;
      }
    }, [btnColor, btnText, themeColor, type]);
  return (
    <div className={styles.list} style={extraStyle}>
      {
        renderItem
      }
    </div>
  );
};

Service.propTypes = {
  settings: PropTypes.object,
};

export default Service;
