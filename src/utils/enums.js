import MyIcon from '@/components/MyIcon';
import { MoneyCollectOutlined } from '@ant-design/icons';

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
      text: '预定金',
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
      text: '申请关闭中',
      value: 'CLOSING',
    },
    CLOSED: {
      text: '已关闭',
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
  },
  platform: {
    'mp-weixin': {
      text: '微信小程序',
      value: 'mp-weixin',
      icon: <MyIcon type={'weixin'} size={20} color={'#09BB07'} />,
    },
    'mp-alipay': {
      text: '支付宝小程序',
      value: 'mp-alipay',
      icon: <MyIcon type={'zhifubao'} size={20} color={'#06B4FD'} />,
    },
    'mp-baidu': {
      text: '百度小程序',
      value: 'mp-baidu',
      icon: <MyIcon type={'baidu'} size={20} color={'#306CFF'} />,
    },
    'mp-toutiao': {
      text: '抖音小程序',
      value: 'mp-toutiao',
      icon: <MyIcon type={'douyin'} size={20} color={'#070103'} />,
    },
    'offline': {
      text: '线下支付',
      value: 'offline',
      icon:  <MyIcon type={'offline'} size={20} color={'#9266F9'} />,
    },
  },
};
export default Enums;
