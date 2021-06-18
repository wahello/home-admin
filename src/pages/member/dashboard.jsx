import React from 'react';
import { useRequest } from 'umi';
import MemberApi from '@/services/member';
import { Spin } from 'antd';

const MemberDashboard = props => {
  const { data } = useRequest(MemberApi.dashboard);

  return <div>

  </div>
    ;
};


export default MemberDashboard;
