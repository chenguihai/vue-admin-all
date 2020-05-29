import request from '@/utils/request'

export function clueList() {
 
  return request({
    url:'/clueCustomerType',
    method:'get'
  })
}

export function addclue(params) {
 
  return request({
    url:'/clueCustomerType',
    method:'POST',
    params:params
  })
}

export function deleteclue(id) {
  return request({
    url:'/clueCustomerType/'+id,
    method:'DELETE',
  })
}

export function editclue(id,params) {
    
    return request({
      url:'/clueCustomerType/'+id,
      method:'PATCH',
      params:params
    })
}

