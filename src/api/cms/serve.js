import request from '@/utils/request'
export function serveList(params) {
  return request({
    url:'/serviceBrand',
    method:'get',
    params:params
  })
}

export function deleteserve(id) {
  return request({
    url:'/serviceBrand/'+id,
    method:'DELETE',
  })
}
export function updateApplyStatus(data) {
  return request({
    url:'/serviceBrandShow/'+data.id+'/'+data.show,
    method:'GET',
  })
}

export function addserve(params) {
  return request({
    url:'/serviceBrand',
    method:'post',
    data:params
  })
}

export function editserve(id,params) {
  return request({
    url:'/serviceBrand/'+id,
    method:'PATCH',
    data:params
  })
}

export function servetype(pid) {
  return request({
    url:'/getChildrenCategory/'+pid,
    method:'get'
  })
}