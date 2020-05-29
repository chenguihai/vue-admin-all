import request from '@/utils/request'

export function reasonList() {
  return request({
    url:'/refundReason',
    method:'get'
  })
}

export function addreason(params) {
  return request({
    url:'/refundReason',
    method:'POST',
    data:params
  })
}

export function deletereason(id) {
  return request({
    url:'/refundReason/'+id,
    method:'DELETE',
  })
}

export function editreason(id,params) {
    return request({
      url:'/refundReason/'+id,
      method:'PATCH',
      data:params
    })
}

