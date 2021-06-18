const msgBusiness =[
  {
    text: '订单',
    value: 'ORDER',
    desc: '客户预约服务',
    actions: [
      {
        text: '确认订单',
        value: 'ORDER_CONFIRM',
        desc: '客户下单后，商家确认订单后通知客户',
      },
      {
        text: '开始服务',
        value: 'ORDER_BEGIN_SERVICE',
        desc: '订单开始服务后通知客户',
      }, {
        text: '服务完成',
        value: 'ORDER_SERVICE_FINISH',
        desc: '服务完成时通知客户',
      },
    ],
  },
  {
    text: '取消订单',
    value: 'CANCEL',
    desc: '客户申请取消订单',
    actions: [],
  },
  {
    text: '佣金提现',
    value: 'WITHDRAW',
    desc: '客户申请提现',
    actions:[
      {
        text: '提现审核结果通知',
        value: 'WITHDRAW_CHECK_RESULT',
        desc: '客户申请提现，商家审核后通知客户',
      }, {
        text: '提现到账通知',
        value: 'WITHDRAW_SUCCESS',
        desc: '客户提现到账后通知客户',
      },
    ]
  }
] ;
export default msgBusiness
