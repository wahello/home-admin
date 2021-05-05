import React, { useEffect, useState } from 'react';
import { Col, DatePicker, Row, Space } from 'antd';
import ProCard from '@ant-design/pro-card';
import classNames from 'classnames';
import styles from './ServiceRow.less';
import moment from 'moment';
import { Column } from '@ant-design/charts';

const dateRanges = [{
  label: '今日',
  value: [moment(), moment()],
}, {
  label: '本周',
  value: [moment().subtract(1, 'weeks'), moment()],
}, {
  label: '本月',
  value: [moment().subtract(1, 'months'), moment()],
}, {
  label: '本年',
  value: [moment().subtract(1, 'year'), moment()],
}];


const config = {
  data: [
    {
      month: '1',
      value: 1078,
    },
    {
      month: '2',
      value: 1216,
    },
    {
      month: '3',
      value: 758,
    },
    {
      month: '4',
      value: 623,
    },
    {
      month: '5',
      value: 319,
    },
    {
      month: '6',
      value: 422,
    },
    {
      month: '7',
      value: -4,
    },
    {
      month: '8',
      value: -217,
    },
    {
      month: '9',
      value: -358,
    },
    {
      month: '10',
      value: 1513,
    },
    {
      month: '11',
      value: 1388,
    },
    {
      month: '12',
      value: 597,
    },
  ],
  xField: 'month',
  yField: 'value',
  height: 400,
  meta: {
    month: {
      formatter: function formatter(val) {
        return "".concat(val, '月');
      },
    },
  },
};

const ServiceRow = () => {
  const [currentTab, setCurrentTab] = useState('sales');

  const [currentRange, setCurrentRange] = useState(0);
  const [queryRange, setQueryRange] = useState(dateRanges[currentRange]?.value);
  useEffect(() => {
    if (currentRange >= 0) {
      setQueryRange(dateRanges[currentRange].value);
    }
  }, [currentRange]);
  useEffect(() => {
    setCurrentRange(dateRanges.findIndex(range => range.value === queryRange));
  }, [queryRange]);
  return <ProCard
    tabs={{
      activeKey: currentTab,
      onChange: setCurrentTab,
      tabBarExtraContent: {
        right: <Space size={'large'} style={{ paddingRight: 16 }}>
          <Space size={'large'}>
            {dateRanges.map((range, idx) => <span key={range.label} onClick={() => setCurrentRange(idx)}
                                                  className={classNames(styles.date, currentRange === idx && styles.active)}>{range.label}</span>)}
          </Space>
          <DatePicker.RangePicker value={queryRange} onChange={setQueryRange} />
        </Space>,
      },
    }}
  >
    <ProCard.TabPane key='sales' tab='销售额'>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={12} xl={16}>
          <ProCard title='销售额趋势'>
            <Column  {...config} />
          </ProCard>
        </Col>
        <Col xs={24} sm={24} md={12} xl={8}>
          <ProCard title='服务销售额排名'>
          </ProCard>
        </Col>
      </Row>
    </ProCard.TabPane>
    <ProCard.TabPane key='visits' tab='访问量'>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={12} xl={16}>
          <ProCard title='访问量趋势'>
            <Column  {...config} />
          </ProCard>
        </Col>
        <Col xs={24} sm={24} md={12} xl={8}>
          <ProCard title='服务访问量排名'>
          </ProCard>
        </Col>
      </Row>
    </ProCard.TabPane>
  </ProCard>;
};


export default ServiceRow;
