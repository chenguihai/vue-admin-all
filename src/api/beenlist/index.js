import request from '@/utils/request'

//入驻申请 - 列表 / 查询
export function beenList(params) {
  return request({
    url:'/storeCanStationList',
    method:'GET',
    params:params
  })
}

//店铺 - 推荐
export function recommend(param) {
    return request({
        url:'/recommend/'+param.id+'/'+param.type,
        method:'GET'
    })
}

//店铺 - 技术费免费额度
export function freeAmount(param) {
    let params = {
        free_amount:param.free_amount
    }
    return request({
        url:'/freeAmount/'+param.store_id,
        method:'GET',
        params:params
    })
}

//店铺 - 关闭
export function Closeshop(param) {
    let params = {
        close_note:param.close_note
    }
    return request({
        url:'/storeReview/'+param.id+'/'+param.type,
        method:'GET',
        params:params
    })
}

//开通店铺
export function Openshop(param) {
    return request({
        url:'/storeReview/'+param.id+'/'+param.type,
        method:'GET'
    })
}