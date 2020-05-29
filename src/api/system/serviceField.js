import request from '@/utils/request'

export function serviceRealm() {
  return request({
    url:'/serviceRealm',
    method:'get'
  })
}

export function addField(params) {

  return request({
    url:'/serviceRealm',
    method:'POST',
    data:params
  })
}

export function deleteField(id) {
  return request({
    url:'/serviceRealm/'+id,
    method:'DELETE',
  })
}

export function editField(id,params) {
    return request({
      url:'/serviceRealm/'+id,
      method:'PATCH',
      data:params
    })
}

