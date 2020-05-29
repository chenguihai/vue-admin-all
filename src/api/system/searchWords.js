import request from '@/utils/request'

export function keyword(data) { //搜索热词 - 列表
  return request({
    url: '/keyword',
    method: 'get',
    params: data
  })
}

export function addKeyword(param) { //搜索热词 - 新增
  return request({
    url: '/keyword',
    method: 'post',
    data: param
  })
}

export function editKeyword(id, param) { //搜索热词 - 编辑
  return request({
    url: '/keyword/' + id,
    method: 'patch',
    data: param
  })
}

export function deleteKeyword(id) { //搜索热词 - 删除
  return request({
    url: '/keyword/' + id,
    method: 'delete',
  })
}
