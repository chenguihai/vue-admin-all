import request from '@/utils/request'

export function serviceList(params) {
  return request({
    url:'/serviceInc',
    method:'get',
    params:params
  })
}

export function addservice(params) {
  return request({
    url:'/serviceInc',
    method:'POST',
    data:params
  })
}

export function deleteservice(id) {
  return request({
    url:'/serviceInc/'+id,
    method:'DELETE',
  })
}

export function editservice(id,params) {
    return request({
      url:'/serviceInc/'+id,
      method:'PATCH',
      data:params
    })
}

export function editstatus(params) {
    return request({
      url:'/serviceIncShow/'+params.id+'/'+params.show,
      method:'GET'
    })
}
