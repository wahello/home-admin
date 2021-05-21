import React from 'react';
import PropTypes from 'prop-types';
import { Card, Col, Row } from 'antd';
import MyIcon from '@/components/MyIcon';
import { Link } from 'umi';

const EntranceRow = props => {
  return (
    <Row gutter={16}>
      <Col span={3}>
        <Link to={'/order'}>
          <Card size={'small'} style={{ textAlign: 'center' }} hoverable>
            <MyIcon type={'order'} size={40} />
            <br />
            <span>订单管理</span>
          </Card>
        </Link>
      </Col>
      <Col span={3}>
        <Link to={'/member/manage'}>
          <Card size={'small'} style={{ textAlign: 'center' }} hoverable>
            <MyIcon type={'user'} size={40} />
            <br />
            <span>用户管理</span>
          </Card>
        </Link>
      </Col>
      <Col span={3}>
      <Link to={'/shop/service/list'}>

          <Card size={'small'} style={{ textAlign: 'center' }} hoverable>
            <MyIcon type={'service'} size={40} />
            <br />
            <span>服务管理</span>
          </Card>

      </Link>
      </Col>
      <Col span={3}>
        <Link to={'/finance/withdraw/list'}>
          <Card size={'small'} style={{ textAlign: 'center' }} hoverable>
            <MyIcon type={'withdraw'} size={40} />
            <br />
            <span>提现审核</span>
          </Card>
        </Link>
      </Col>
      <Col span={3}>
        <Card size={'small'} style={{ textAlign: 'center' }} hoverable>
          <MyIcon type={'article'} size={40} />
          <br />
          <span>文章管理</span>
        </Card>
      </Col>
      <Col span={3}>
        <Link to={'/app/diy'}>
          <Card size={'small'} style={{ textAlign: 'center' }} hoverable>
            <MyIcon type={'diy'} size={40} />
            <br />
            <span>首页装修</span>
          </Card>
        </Link>
      </Col>
      <Col span={3}>
        <Link to={'/promotion/coupon/list'}>
          <Card size={'small'} style={{ textAlign: 'center' }} hoverable>
            <MyIcon type={'coupon'} size={40} />
            <br />
            <span>优惠券</span>
          </Card>
        </Link>
      </Col>
      <Col span={3}>
        <Link to={'/promotion/group/list'}>
          <Card size={'small'} style={{ textAlign: 'center' }} hoverable>
            <MyIcon type={'poster'} size={40} />
            <br />
            <span>拼团活动</span>
          </Card>
        </Link>
      </Col>
    </Row>
  );
};

EntranceRow.propTypes = {};

export default EntranceRow;
