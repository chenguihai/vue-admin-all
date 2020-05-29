import request from '@/utils/request'

export function accountList(params) { //账户余额明细 - 列表 / 查询
  return request({
    url: '/accountDetails',
    method: 'get',
    params: params
  })
}

export function depositList(params) {//保证金明细 - 列表 / 查询
  return request({
    url: '/depositDetails',
    method: 'get',
    params: params
  })
}

export function platformIncomeList(params) {//平台收入明细 - 列表 / 查询
  return request({
    url: '/platformIncomeDetails',
    method: 'get',
    params: params
  })
}

export function orderSettleList(params) {//订单结算明细 - 列表 / 查询
  return request({
    url: '/orderSettleDetails',
    method: 'get',
    params: params
  })
}

export function cashOutList(params) {//资金提现 - 列表 / 查询
  return request({
    url: '/cashOut',
    method: 'get',
    params: params
  })
}

export function cashCheck(params) {//资金提现 - 审核
  return request({
    url: '/cashCheck',
    method: 'post',
    data: params
  })
}

export function cashPay(params) {//资金提现 - 确认打款
  return request({
    url: '/cashPay',
    method: 'post',
    data: params
  })
}

export function settleAccount(params) {//代付账户余额明细 - 列表 / 查询

  return request({
    url: '/settleAccountDetails',
    method: 'get',
    params
  })
}

export function tradeType() {//获取交易类型
  return request({
    url: '/tradeType',
    method: 'get',
  })
}
