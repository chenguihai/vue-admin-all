import request from '@/utils/request'

// get
export function mediaCompanyList(params) { //隶属媒体公司 - 列表 / 查询
  return request({
    url: '/mediaCompany',
    method: 'get',
    params: params
  })
}
export function mediaCompanyById(params,id,type) { //隶属媒体公司 - 审核
  return request({
    url: '/mediaCompanyReview/'+id+'/'+type,
    method: 'get',
    params: params
  })
}
export function mediaAptitudeList(params) { //媒介资质 - 列表 / 查询
  return request({
    url: '/mediaAptitude',
    method: 'get',
    params: params
  })
}
export function mediaAptitudeReviewById(params,id,type) { //媒介资质 - 审核
  return request({
    url: '/mediaAptitudeReview/'+id+'/'+type,
    method: 'get',
    params: params
  })
}
