import request from '@/utils/request'

export function listItem(params) { //订单结算申请 - 列表 / 查询
  return request({
    url: '/settleApplyList',
    method: 'get',
    params: params
  })
}

export function settleDetail(id) { //查看委托授权
  return request({
    url: '/settleDetail/' + id,
    method: 'get',
  })
}

export function settleCheck(data) { //订单结算申请 - 审核
  return request({
    url: '/settleCheck',
    method: 'post',
    data
  })
}

export function contractConfirm(id) { //确认代签合同
  return request({
    url: '/settleContractConfirm/' + id,
    method: 'get',
  })
}

export function settleApply(data) { //申请代付
  return request({
    url: '/settleApply',
    method: 'post',
    data
  })
}

export function commission(id) { //计算可转出的佣金
  return request({
    url: '/settleCommission/' + id,
    method: 'get',
  })
}

export function commissionOut(data) { //申请订单佣金转出
  return request({
    url: '/settleCommissionOut',
    method: 'post',
    data
  })
}

export function settleApplyBefore(id) { //代付申请检测
  return request({
    url: '/settleApplyBefore/' + id,
    method: 'get',
  })
}
