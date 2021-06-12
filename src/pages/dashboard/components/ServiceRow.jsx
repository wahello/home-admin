import React from 'react';
import { Col, Row } from 'antd';
import ProCard from '@ant-design/pro-card';
import ProTable from '@ant-design/pro-table';
import { useRequest } from '@@/plugin-request/request';
import StatisticApi from '@/services/statistic';

const visitColumn = [{
  dataIndex: 'index',
  valueType: 'indexBorder',
  title: '排名',
  width: 48,
  align: 'center',
}, {
  dataIndex: 'name',
  title: '服务',
}, {
  dataIndex: 'visit_count',
  title: '访问量',
  align: 'center',
}];
const orderNumColumn = [{
  dataIndex: 'index',
  valueType: 'indexBorder',
  title: '排名',
  width: 48,
  align: 'center',
}, {
  dataIndex: ['service','name'],
  title: '服务',
}, {
  dataIndex: 'orderNum',
  title: '订单量',
  align: 'center',
}];

const saleTotalColumn = [{
  dataIndex: 'index',
  valueType: 'indexBorder',
  title: '排名',
  width: 48,
  align: 'center',
}, {
  dataIndex: ['service','name'],
  title: '服务',
}, {
  dataIndex: 'saleTotal',
  title: '成交金额',
  valueType: 'money',
  align: 'center',
}];

const ServiceRow = props => {

  const { data, loading } = useRequest(StatisticApi.serviceData);

  return (
    <Row gutter={16}>
      <Col span={8}>
        <ProCard title={'服务浏览排行'} loading={loading}>
          <ProTable style={{height:300}} columns={visitColumn} dataSource={data?.visitData} search={false} toolBarRender={false}
                    pagination={false} />
        </ProCard>
      </Col>
      <Col span={8}>
        <ProCard title={'服务订单排行'} loading={loading}>
          <ProTable style={{height:300}} columns={orderNumColumn} dataSource={data?.orderNumData} search={false} toolBarRender={false}
                    pagination={false} />
        </ProCard>
      </Col>
      <Col span={8}>
        <ProCard  title={'服务金额排行'} loading={loading}>
          <ProTable style={{height:300}}  columns={saleTotalColumn} dataSource={data?.saleTotalData} search={false} toolBarRender={false}
                    pagination={false} />
        </ProCard>
      </Col>
    </Row>
  );
};


export default ServiceRow;
