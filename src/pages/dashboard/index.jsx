import React from 'react';
import { Space } from 'antd';
import IntroduceRow from '@/pages/dashboard/components/IntroduceRow';
import OrderRow from '@/pages/dashboard/components/OrderRow';
import EntranceRow from '@/pages/dashboard/components/EntranceRow';
import ServiceRow from '@/pages/dashboard/components/ServiceRow';


const Dashboard = () => {


  return (
    <Space style={{ width: '100%' }} direction={'vertical'} size={'large'}>
      <IntroduceRow />
      <EntranceRow />
      <OrderRow />
      <ServiceRow />
    </Space>
  );
};


export default Dashboard;
