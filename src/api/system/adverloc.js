import request from '@/utils/request'

export function adverlocList(params) {
  return request({
    url:'/adPosition',
    method:'get',
    params:params
  })
}

export function addadverloc(params) {
  return request({
    url:'/adPosition',
    method:'POST',
    data:params
  })
}

export function deleteadverloc(id) {
  return request({
    url:'/adPosition/'+id,
    method:'DELETE',
  })
}

export function editadverloc(id,params) {
  return request({
    url:'/adPosition/'+id,
    method:'PATCH',
    data:params
  })
}

