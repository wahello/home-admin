import MyIcon from '@/components/MyIcon';
import { MailFilled, WalletOutlined } from '@ant-design/icons';
import React from 'react';

const Enums = {
  discountType: {
    DEDUCTION: {
      text: '立减券',
      value: 'DEDUCTION',
    },
    REBATE: {
      text: '折扣券',
      value: 'REBATE',
    },
  },
  expireType: {
    DATE: {
      text: '固定日期',
      value: 'DATE',
    },
    DAY: {
      text: '领取之日起',
      value: 'DAY',
    },
  },
  payType: {
    PART: {
      text: '定金',
      value: 'PART',
    },
    BEFORE: {
      text: '先付款',
      value: 'BEFORE',
    },
    AFTER: {
      text: '后付款',
      value: 'AFTER',
    },
  },
  serviceState: {
    NOT_SALE: {
      text: '未上架',
      value: 'NOT_SALE',
      status: 'Default',
    },
    IN_SALE: {
      text: '销售中',
      value: 'IN_SALE',
      status: 'Processing',
    },
  },
  orderState: {
    WAIT_PAY_PART: {
      text: '待支付定金',
      value: 'WAIT_PAY_PART',
    },
    WAIT_PAY: {
      text: '待支付',
      value: 'WAIT_PAY',
    },
    WAIT_CONFIRM: {
      text: '待确认',
      value: 'WAIT_CONFIRM',
    },
    WAIT_SERVICE: {
      text: '待服务',
      value: 'WAIT_SERVICE',
    },
    SERVICING: {
      text: '服务中',
      value: 'SERVICING',
    },
    SERVICE_FINISHED: {
      text: '待客户确认',
      value: 'SERVICE_FINISHED',
    },
    WAIT_PAY_AFTER: {
      text: '待支付尾款',
      value: 'WAIT_PAY_AFTER',
    },
    WAIT_EVALUATE: {
      text: '待评价',
      value: 'WAIT_EVALUATE',
    },
    FINISHED: {
      text: '已完成',
      value: 'FINISHED',
    },
    CLOSING: {
      text: '申请取消中',
      value: 'CLOSING',
    },
    CLOSED: {
      text: '已取消',
      value: 'CLOSED',
    },
  },
  payState: {
    WAIT_PAY: {
      text: '待支付',
      value: 'WAIT_PAY',
    },
    PAID: {
      text: '已付款',
      value: 'PAID',
    },
    CANCELED: {
      text: '已取消',
      value: 'CANCELED',
    },
  },
  platform: {
    'MP_WEIXIN': {
      text: '微信小程序',
      value: 'MP_WEIXIN',
      icon: <MyIcon type={'weixin'} size={20} color={'#09BB07'} />,
    },
    'MP_ALIPAY': {
      text: '支付宝小程序',
      value: 'MP_ALIPAY',
      icon: <MyIcon type={'zhifubao'} size={20} color={'#06B4FD'} />,
    },
    'MP-BAIDU': {
      text: '百度小程序',
      value: 'MP-BAIDU',
      icon: <MyIcon type={'baidu'} size={20} color={'#306CFF'} />,
    },
    'MP-TOUTIAO': {
      text: '抖音小程序',
      value: 'MP-TOUTIAO',
      icon: <MyIcon type={'douyin'} size={20} color={'#070103'} />,
    },
  },
  payChannel: {
    WXPAY: {
      text: '微信支付',
      value: 'WXPAY',
      icon: <MyIcon type={'weixin'} size={20} color={'#09BB07'} />,
    },
    ALIPAY: {
      text: '支付宝支付',
      value: 'ALIPAY',
      icon: <MyIcon type={'zhifubao'} size={20} color={'#06B4FD'} />,
    },
    BALANCE: {
      text: '余额支付',
      value: 'BALANCE',
      icon: <WalletOutlined style={{ fontSize: 20, color: '#ff9900' }} />,
    },
    OFFLINE: {
      text: '线下支付',
      value: 'OFFLINE',
      icon: <MyIcon type={'offline'} size={20} color={'#9266F9'} />,
    },
  },
  orderType: {
    NORMAL: {
      text: '普通订单',
      value: 'NORMAL',
      color: '#87d068',
    },
    GROUP: {
      text: '拼团',
      value: 'GROUP',
      color: '#F50',
    },
  },
  groupRecordState: {
    PROCESSING: {
      text: '拼团中',
      value: 'PROCESSING',
      color: '#ff9900',
    },
    FAILED: {
      text: '拼团失败',
      value: 'FAILED',
      color: '#fa3534',
    },
    SUCCESS: {
      text: '拼团成功',
      value: 'SUCCESS',
      color: '#51bc81',
    },
  },
  refundChannel: {
    ORIGINAL: {
      text: '原路退回',
      value: 'ORIGINAL',
    },
    TRANSFORM: {
      text: '手动转账',
      value: 'TRANSFORM',
    },
  },
  refundType: {
    AUTO: {
      text: '自动退款',
      value: 'AUTO',
    },
    MANUAL: {
      text: '手动退款',
      value: 'MANUAL',
    },
  },
  refundState: {
    REFUNDING: {
      text: '退款中',
      value: 'REFUNDING',
    },
    SUCCESS: {
      text: '退款成功',
      value: 'SUCCESS',
    },
    FAILED: {
      text: '退款失败',
      value: 'FAILED',
    },
  },
  giftType: {
    NONE: {
      text: '未中奖',
      value: 'NONE',
    },
    COUPON: {
      text: '优惠券',
      value: 'COUPON',
    },
    BALANCE: {
      text: '余额红包',
      value: 'BALANCE',
    },
    INTEGRAL: {
      text: '积分',
      value: 'INTEGRAL',
    },
  },
  accountType: {
    INTEGRAL: {
      text: '积分',
      value: 'INTEGRAL',
    },
    BALANCE: {
      text: '余额',
      value: 'BALANCE',
    },
  },
  accountAction: {
    REGISTER: {
      text: '注册',
      value: 'REGISTER',
    },
    CONSUME: {
      text: '消费',
      value: 'CONSUME',
    },
    CONSUME_REWARD: {
      text: '消费奖励',
      value: 'CONSUME_REWARD',
    },
    SYSTEM: {
      text: '系统调整',
      value: 'SYSTEM',
    },
    LUCKY: {
      text: '抽奖花费',
      value: 'LUCKY',
    },
    LUCKY_GIFT: {
      text: '抽奖奖品',
      value: 'LUCKY_GIFT',
    },
    RECHARGE: {
      text: '充值',
      value: 'RECHARGE',
    },
    REFUND: {
      text: '退还',
      value: 'REFUND',
    },
  },
  gender: {
    MAN: {
      text: '男',
      value: '1',
    },
    WOMAN: {
      text: '女',
      value: '2',
    },
    UNKNOWN: {
      text: '未知',
      value: '0',
    },
  },
  withdrawState: {
    WAIT_AGREE: {
      text: '待审核',
      value: 'WAIT_AGREE',
    },
    WAIT_PAY: {
      text: '待转账',
      value: 'WAIT_PAY',
    },
    PAID: {
      text: '已转账',
      value: 'PAID',
    },
    REJECT: {
      text: '已拒绝',
      value: 'REJECT',
    },
  },
  rebateRecordState: {
    WAIT_COMPLETE: {
      text: '待订单完成',
      value: 'WAIT_COMPLETE',
    },
    COMPLETE: {
      text: '订单已完成',
      value: 'COMPLETE',
    },
    CANCELED: {
      text: '订单已取消',
      value: 'CANCELED',
    },
  },
  authState: {
    NOT_AUTH: {
      text: '未认证',
      value: 'NOT_AUTH',
      status: 'default',
    },
    AUTHING: {
      text: '认证审核中',
      value: 'AUTHING',
      status: 'processing',
    },
    PASSED: {
      text: '已通过',
      value: 'PASSED',
      status: 'success',
    },
    FAILED: {
      text: '认证失败',
      value: 'FAILED',
      status: 'error',
    },
  },
  msgPlatform:{
    SMS: {
      text: '短信',
      value: 'SMS',
      icon: <MailFilled style={{color:'#0ea5e9',fontSize:20}}  />,
    },
    WECHAT: {
      text: '微信',
      value: 'WECHAT',
      icon: <MyIcon type={'weixin'} size={20} color={'#09BB07'} />,
    },
  }
};
export default Enums;
