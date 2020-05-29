import request from '@/utils/request'

//入驻申请 - 列表 / 查询
export function shopList(params) {
  return request({
    url: '/storeNotStationList',
    method: 'GET',
    params: params
  })
}

//店铺 - 详情
export function shopdetail(store_id) {
  return request({
    url: '/storeDetail/' + store_id,
    method: 'GET'
  })
}

//店铺 - 实名认证审核
export function realverify(param) {
  let params = {
    fail_note: param.fail_note || '',
    fail_reasons: param.fail_reasons
  }
  return request({
    url: '/signAccountReview/' + param.id + '/' + param.type,
    method: 'GET',
    params: params
  })
}

//媒介资质审核
export function mediumverify(param) {
  let params = {
    fail_note: param.fail_note || ''
  }
  return request({
    url: '/mediaAptitudeReview/' + param.id + '/' + param.type,
    method: 'GET',
    params: params
  })
}

//隶属媒体公司审核
export function companyverify(param) {
  let params = {
    fail_note: param.fail_note || ''
  }
  return request({
    url: '/mediaCompanyReview/' + param.id + '/' + param.type,
    method: 'GET',
    params: params
  })
}

//店铺基本信息审核
export function shopinfoverify(param) {
  let params = {
    fail_note: param.fail_note || ''
  }
  return request({
    url: '/storeReview/' + param.id + '/' + param.type,
    method: 'GET',
    params: params
  })
}

export function getApplyDetail(id) {
  return request({
    url: '/returnApply/' + id,
    method: 'get'
  })
}

