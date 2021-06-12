import React, { useMemo } from 'react';
import { Area, Column } from '@ant-design/charts';
import { useRequest } from 'umi';
import StatisticApi from '@/services/statistic';
import { Button, Col, Empty, Row, Space } from 'antd';
import errorSvg from '@/assets/error.svg';
import ProCard, { Statistic, StatisticCard } from '@ant-design/pro-card';
import dayjs from 'dayjs';


const colProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
};

const todayRowFields = [{
  key: 'order',
  label: '订单数',
  color: '#975FE4',
  tip: '今日预约未取消的订单',
  component: Area,
}, {
  key: 'sale',
  label: '销售额',
  color: '#6DD48C',
  tip: '',
  component: Column,
}, {
  key: 'user',
  label: '新增用户数',
  color: '#F2637B',
  tip: '',
  component: Area,
}, {
  key: 'visit',
  label: '访问量',
  color: '#58AFFF',
  tip: '今日打开应用用户量，30分钟内同一用户只统计一次',
  component: Column,
}];
const weeks = [
  dayjs().subtract(7, 'days').format('YYYY-MM-DD'),
  dayjs().subtract(6, 'days').format('YYYY-MM-DD'),
  dayjs().subtract(5, 'days').format('YYYY-MM-DD'),
  dayjs().subtract(4, 'days').format('YYYY-MM-DD'),
  dayjs().subtract(3, 'days').format('YYYY-MM-DD'),
  dayjs().subtract(2, 'days').format('YYYY-MM-DD'),
  dayjs().subtract(1, 'days').format('YYYY-MM-DD'),
  dayjs().format('YYYY-MM-DD'),
];
const IntroduceRow = () => {
  const { data, loading, run, error } = useRequest(StatisticApi.todayData);
  const orderFormatData = useMemo(() => {
    if (data) {
      const { weekOrderData, totalOrderData={} } = data;
      const orderData = weeks.map(date => {
        const value = weekOrderData.find(it => it.date === date);
        return {
          date,
          orderNum: value?.orderNum || 0,
          saleTotal: value?.saleTotal || 0,
        };
      });
      return { weekOrderData: orderData, totalOrderData };
    }
    return null;
  }, [data]);


  const orderNumData = useMemo(() => {
    if (orderFormatData) {
      const { weekOrderData, totalOrderData } = orderFormatData;
      const todayData = weekOrderData[7];
      const yesterdayData = weekOrderData[6];
      const lastWeekDayData = weekOrderData[0];
      const today = todayData.orderNum;
      const yesterday = yesterdayData.orderNum;
      const lastWeekDay = lastWeekDayData.orderNum;
      return {
        today,
        yesterday,
        dayCompare: yesterday > 0 ? ((today - yesterday) / yesterday) : (today > 0 ? 1 : 0),
        weekCompare: lastWeekDay > 0 ? ((today - lastWeekDay) / lastWeekDay) : (today > 0 ? 1 : 0),
        total: totalOrderData.orderNum,
        list: weekOrderData.map(it => ({ date: it.date, value: it.orderNum })),
      };
    }
    return null;
  }, [orderFormatData]);

  const saleTotalData = useMemo(() => {
    if (orderFormatData) {
      const { weekOrderData, totalOrderData } = orderFormatData;
      const todayData = weekOrderData[7];
      const yesterdayData = weekOrderData[6];
      const lastWeekDayData = weekOrderData[0];
      const today = todayData.saleTotal;
      const yesterday = yesterdayData.saleTotal;
      const lastWeekDay = lastWeekDayData.saleTotal;
      return {
        today,
        yesterday,
        dayCompare: yesterday > 0 ? ((today - yesterday) / yesterday) : (today > 0 ? 1 : 0),
        weekCompare: lastWeekDay > 0 ? ((today - lastWeekDay) / lastWeekDay) : (today > 0 ? 1 : 0),
        total: totalOrderData.saleTotal,
        list: weekOrderData.map(it => ({ date: it.date, value: it.saleTotal })),
      };
    }
    return null;
  }, [orderFormatData]);


  const userNumData = useMemo(() => {
    if (data) {
      const { weekRegisterData, totalRegisterCount } = data;
      const weekFormatData = weeks.map(date => {
        const value = weekRegisterData.find(it => it.date === date);
        return {
          date,
          value: value?.count || 0,
        };
      });
      const todayData = weekFormatData[7];
      const yesterdayData = weekFormatData[6];
      const lastWeekDayData = weekFormatData[0];
      const today = todayData.value;
      const yesterday = yesterdayData.value;
      const lastWeekDay = lastWeekDayData.value;
      return {
        today,
        yesterday,
        dayCompare: yesterday > 0 ? ((today - yesterday) / yesterday) : (today > 0 ? 1 : 0),
        weekCompare: lastWeekDay > 0 ? ((today - lastWeekDay) / lastWeekDay) : (today > 0 ? 1 : 0),
        total: totalRegisterCount,
        list: weekFormatData,
      };
    }
    return null;
  }, [data]);

  const visitsData = useMemo(() => {
    if (data) {
      const { weekVisitData, totalVisitCount } = data;
      const weekFormatData = weeks.map(date => {
        const value = weekVisitData.find(it => it.date === date);
        return {
          date,
          value: value?.count || 0,
        };
      });
      const todayData = weekFormatData[7];
      const yesterdayData = weekFormatData[6];
      const lastWeekDayData = weekFormatData[0];
      const today = todayData.value;
      const yesterday = yesterdayData.value;
      const lastWeekDay = lastWeekDayData.value;
      return {
        today,
        yesterday,
        dayCompare: yesterday > 0 ? ((today - yesterday) / yesterday) : (today > 0 ? 1 : 0),
        weekCompare: lastWeekDay > 0 ? ((today - lastWeekDay) / lastWeekDay) : (today > 0 ? 1 : 0),
        total: totalVisitCount,
        list: weekFormatData,
      };
    }
    return null;
  }, [data]);



  const allData = useMemo(() => {
    return {
      order: orderNumData,
      sale: saleTotalData,
      user: userNumData,
      visit: visitsData,
    };
  }, [orderNumData, saleTotalData, userNumData, visitsData]);


  return error ? <ProCard>
    <Empty
      image={errorSvg}
      description={'加载失败'}
    >
      <Button type='primary' onClick={() => run()}>重新加载</Button>
    </Empty>
  </ProCard> : <Row gutter={[16, 24]}>
    {
      todayRowFields.map(field => {
        const Chart = field.component;
        return <Col {...colProps} key={field.key}>
          <StatisticCard
            loading={loading}
            hoverable
            statistic={{
              title: `今日${field.label}`,
              tip: field.tip,
              value: allData?.[field.key]?.today,
              description: (
                <Space>
                  <Statistic title='日同比'
                             precision={2}
                             value={allData?.[field.key]?.dayCompare * 100}
                             suffix='%' trend={allData?.[field.key]?.dayCompare >= 0 ? 'up' : 'down'} />
                  <Statistic title='周同比'
                             precision={2}
                             value={allData?.[field.key]?.weekCompare * 100}
                             suffix='%' trend={allData?.[field.key]?.weekCompare >= 0 ? 'up' : 'down'}
                  />

                </Space>
              ),
            }}
            chart={
              <Chart color={field.color} data={allData?.[field.key]?.list || []}
                     smooth
                     areaStyle={{ fillOpacity: 1 }}
                     line={{ size: 0 }}
                     xAxis={{
                       range: Chart === Area ? [0, 1] : null,
                       label: null,
                       line: null,
                     }} yAxis={{
                alias: field.label,
                range: [0, 1],
                grid: null,
                label: null,
              }} xField={'date'} yField={'value'} tooltip={{ crosshairs: false }} height={50} />
            }
            footer={
              <Space>
                <Statistic title={`昨日${field.label}`} value={allData?.[field.key]?.yesterday} />
                <Statistic title={`总${field.label}`} value={allData?.[field.key]?.total} />
              </Space>
            }
          />
        </Col>;
      })
    }
  </Row>;
};


export default IntroduceRow;
