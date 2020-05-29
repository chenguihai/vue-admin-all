import request from '@/utils/request'

export function temList(params) {
 
  return request({
    url:'/storeBasicLevel',
    method:'get',
    params:params
  })
}

export function addtem(params) {
 
  return request({
    url:'/storeBasicLevel',
    method:'POST',
    params:params
  })
}

export function deletetem(id) {
  return request({
    url:'/storeBasicLevel/'+id,
    method:'DELETE',
  })
}

export function edittem(id,params) {
    return request({
      url:'/storeBasicLevel/'+id,
      method:'POST',
      data:params
    })
}

export function editstatus(params) {
    return request({
      url:'/storeBasicLevel/'+id,
      method:'POST',
      data:params
    })
}