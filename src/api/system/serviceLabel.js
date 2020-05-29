import request from '@/utils/request'

export function listItem() { //标签 - 列表
  return request({
    url: '/serviceTag',
    method: 'get'
  })
}

export function addItem(data) { //标签 - 新增
  return request({
    url: '/serviceTag',
    method: 'post',
    data
  })
}

export function editItem(id, data) { //标签 - 编辑
  return request({
    url: '/serviceTag/' + id,
    method: 'patch',
    data
  })
}

export function deleteItem(id) { //标签 -  删除
  return request({
    url: '/serviceTag/' + id,
    method: 'delete',
  })
}
