import React from 'react';
import { Area, Column } from '@ant-design/charts';
import { useRequest } from 'umi';
import StatisticApi from '@/services/statistic';
import { Button, Col, Empty, Row, Space } from 'antd';
import errorSvg from '@/assets/error.svg';
import ProCard, { Statistic, StatisticCard } from '@ant-design/pro-card';


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
  label: '浏览量',
  color: '#58AFFF',
  tip: '',
  component: Column,
}];
const IntroduceRow = () => {
  const { data, loading, run, error } = useRequest(StatisticApi.todayData);
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
              value: data?.[field.key]?.today,
              description: (
                <Space>
                  <Statistic title='日同比'
                             precision={2}
                             value={data?.[field.key]?.dayCompare * 100}
                             suffix='%' trend={data?.[field.key]?.dayCompare > 0 ? 'up' : 'down'} />
                  <Statistic title='周同比'
                             precision={2}
                             value={data?.[field.key]?.weekCompare * 100}
                             suffix='%' trend={data?.[field.key]?.weekCompare > 0 ? 'up' : 'down'}
                  />

                </Space>
              ),
            }}
            chart={
              <Chart color={field.color} data={data?.[field.key]?.list || []}
                     smooth
                     areaStyle={{ fillOpacity: 1 }}
                     line={{ size: 0 }}
                     xAxis={{
                       range: Chart === Area ? [0, 1] : null,
                       label: null,
                       line: null,
                     }} yAxis={{
                alias: '订单数',
                range: [0, 1],
                grid: null,
                label: null,
              }} xField={'date'} yField={'value'} tooltip={{ crosshairs: false }} height={50} />
            }
            footer={
              <Space>
                <Statistic title={`昨日${field.label}`} value={data?.[field.key]?.yesterday} />
                <Statistic title={`总${field.label}`} value={data?.[field.key]?.total} />
              </Space>
            }
          />
        </Col>;
      })
    }
  </Row>;
};


export default IntroduceRow;
