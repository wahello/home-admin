import React from 'react';
import PropTypes from 'prop-types';
import { PageContainer } from '@ant-design/pro-layout';
import { StatisticCard } from '@ant-design/pro-card';

const Dashboard = props => {
  return (
    <PageContainer>
      <StatisticCard.Group>
        <StatisticCard
          statistic={{
            title: '支付金额',
            value: 2176,
            icon: (
              <img
                style={imgStyle}
                src='https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*dr_0RKvVzVwAAAAAAAAAAABkARQnAQ'
                alt='icon'
              />
            ),
          }}
        />
        <StatisticCard
          statistic={{
            title: '访客数',
            value: 475,
            icon: (
              <img
                style={imgStyle}
                src='https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*-jVKQJgA1UgAAAAAAAAAAABkARQnAQ'
                alt='icon'
              />
            ),
          }}
        />
        <StatisticCard
          statistic={{
            title: '支付成功订单数',
            value: 87,
            icon: (
              <img
                style={imgStyle}
                src='https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*FPlYQoTNlBEAAAAAAAAAAABkARQnAQ'
                alt='icon'
              />
            ),
          }}
        />
        <StatisticCard
          statistic={{
            title: '浏览量',
            value: 1754,
            icon: (
              <img
                style={imgStyle}
                src='https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*pUkAQpefcx8AAAAAAAAAAABkARQnAQ'
                alt='icon'
              />
            ),
          }}
        />
      </StatisticCard.Group>
    </PageContainer>
  );
};

Dashboard.propTypes = {};

export default Dashboard;
