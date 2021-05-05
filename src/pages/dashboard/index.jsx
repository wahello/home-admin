import React from 'react';
import { Space } from 'antd';
import IntroduceRow from '@/pages/dashboard/components/IntroduceRow';
import ServiceRow from '@/pages/dashboard/components/ServiceRow';
import MaterialPicker from '@/components/MaterialPicker';


const Dashboard = () => {


  return (
    <Space style={{ width: '100%' }} direction={'vertical'} size={'large'}>
      <IntroduceRow />
      <ServiceRow />
      <MaterialPicker/>
    </Space>
  );
};


export default Dashboard;
