import React, { useMemo, useState } from 'react';
import { Space } from 'antd';
import ProCard from '@ant-design/pro-card';
import classNames from 'classnames';
import styles from './OrderRow.less';
import { DualAxes } from '@ant-design/charts';
import { useRequest } from 'umi';
import StatisticApi from '@/services/statistic';
import moment from 'moment';

const dateRanges = [{
  label: '30天',
  value: 'MONTH',
}, {
  label: '本周',
  value: 'CURRENT_WEEK',
}, {
  label: '本月',
  value: 'CURRENT_MONTH',
}, {
  label: '本年',
  value: 'CURRENT_YEAR',
}];


const OrderRow = () => {
  const [queryRange, setQueryRange] = useState(dateRanges[0]);
  const { data, loading } = useRequest(() => {
    return StatisticApi.orderData({
      rangeType: queryRange.value,
    });
  }, {
    refreshDeps: [queryRange],
  });

  const columnData = useMemo(() => {
    const dateList = [];
    let start;
    const today = moment();
    switch (queryRange.value) {
      case 'MONTH':
        start = moment().subtract(30, 'days');
        break;
      case 'CURRENT_WEEK':
        start = moment().startOf('weeks');
        break;
      case 'CURRENT_MONTH':
        start = moment().startOf('months');
        break;
      case 'CURRENT_YEAR':
        start = moment().startOf('years');
        break;
      default:
        break;
    }
    if (queryRange.value === 'CURRENT_YEAR') {
      const diff = today.diff(start, 'months');
      for (let i = 0; i <= diff; i += 1) {
        dateList.push(start.clone().add(i, 'months').format('YYYY-MM'));
      }
    } else {
      const diff = today.diff(start, 'days');
      for (let i = 0; i <= diff; i += 1) {
        dateList.push(start.clone().add(i, 'days').format('YYYY-MM-DD'));
      }
    }

    return dateList.map(date => {
      return data?.find(it => it.date === date) || {
        date,
        orderNum: 0,
        saleTotal: 0,
      };
    });
  }, [queryRange, data]);
  return <ProCard
    title='订单趋势'
    hoverable
    extra={<Space size={'large'} style={{ paddingRight: 16 }}>
      {dateRanges.map((range) => <span
        key={range.value} onClick={() => setQueryRange(range)}
        className={classNames(styles.date, queryRange === range && styles.active)}>{range.label}</span>)}
    </Space>}
    loading={loading}>
    <DualAxes height={300} xField={'date'} yField={['saleTotal', 'orderNum']} data={[columnData, columnData]}
              yAxis={{
                orderNum: {
                  nice: true,
                },
                saleTotal: {
                  nice: true,
                },
              }}
              meta={{
                saleTotal: {
                  label: {
                    formatter: function formatter(val) {
                      return `￥${val}`;
                    },
                  },
                  alias: '销售额',
                },
                orderNum: {
                  label: {
                    formatter: function formatter(val) {
                      return `${val}单`;
                    },
                  },
                  alias: '订单量',
                },
              }}
              geometryOptions={[
                { geometry: 'column' },
                {
                  geometry: 'line',
                  lineStyle: { lineWidth: 2 },
                },
              ]}
              legend={{
                position: 'top',
              }}
    />
  </ProCard>;
};


export default OrderRow;
