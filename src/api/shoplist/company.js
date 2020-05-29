import request from '@/utils/request'
//店铺 - 企业实名认证审核
export function businessverify(param) {
    let params = {
      fail_reasons:param.fail_reasons,
      fail_note:param.fail_note||''
    }
  return request({
    url:'/signAccountReview/'+param.id+'/'+param.type,
    method:'GET',
    params:params
  })
}