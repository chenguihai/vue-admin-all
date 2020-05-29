import request from '@/utils/request'

export function listServe() { //店铺装修
  return request({
    url: '/toolsStoreRenovation',
    method: 'get'
  })
}


export function editServe(id, data) {//店铺装修 - 编辑
  return request({
    url: '/toolsStoreRenovation/' + id,
    method: 'patch',
    data
  })
}

export function deleteServe(id) {//店铺装修 - 删除价格配置
  return request({
    url: '/toolsStoreRenovation/' + id,
    method: 'delete',
  })
}

