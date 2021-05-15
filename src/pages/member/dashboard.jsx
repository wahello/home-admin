import React from 'react';
import { useRequest } from 'umi';
import MemberApi from '@/services/member';
import { Spin } from 'antd';

const MemberDashboard = props => {
  const {data} = useRequest(MemberApi.dashboard)
  console.log(data);
  return (
    <Spin>

    </Spin>
  );
};



export default MemberDashboard;
