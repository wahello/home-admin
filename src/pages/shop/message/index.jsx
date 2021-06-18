import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import MessageList from '@/pages/shop/message/components/MessageList';
import SmsBuy from '@/pages/shop/message/components/SmsBuy';
import SmsSign from '@/pages/shop/message/components/SmsSign';


const MessageConfig = props => {
  const [currentTab, setCurrentTab] = useState('message');

  return (
    <PageContainer
      tabActiveKey={currentTab}
      onTabChange={setCurrentTab}
      tabList={[
        {
          tab: '通知设置',
          key: 'message',
        },
        {
          tab: '短信签名',
          key: 'smsSign',
        },
        {
          tab: '短信订购',
          key: 'smsBuy',
        },
        {
          tab: '短信记录',
          key: 'smsRecord',
        },
      ]}
    >
      {
        currentTab === 'message' && <MessageList />
      }
      {
        currentTab === 'smsSign' && <SmsSign />
      }
      {
        currentTab === 'smsBuy' && <SmsBuy />
      }
    </PageContainer>
  );
};


export default MessageConfig;
