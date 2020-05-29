import request from '@/utils/request'

export function gradeList(params) {
  return request({
    url:'/storeBasicLevel',
    method:'get',
    params:params
  })
}

export function addshop(params) {
  return request({
    url:'/storeBasicLevel',
    method: 'post',
    data: params
  })
}

export function deleteshop(id) {
  return request({
    url:'/storeBasicLevel/'+id,
    method: 'delete',
  })
}

export function editshop(id,params) {
    return request({
      url:'/storeBasicLevel/'+id,
      method: 'patch',
      data:params
    })
  }

