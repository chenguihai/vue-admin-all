import request from '@/utils/request'

export function specsList(params) {//规格属性 - 列表 / 查询
  return request({
    url: '/serviceSpecAttr',
    method: 'get',
    params: params
  })
}

export function deleteSpecs(id) {//规格属性 - 删除
  return request({
    url: '/serviceSpecAttr/' + id,
    method: 'DELETE',
  })
}

export function specsShow(params) { //规格属性 - 显示
  return request({
    url: '/serviceSpecAttrShow/' + params.id + '/' + params.show,
    method: 'get',
  })
}

export function addSpecs(params) { //规格属性 - 新增
  return request({
    url: '/serviceSpecAttr',
    method: 'post',
    data: params
  })
}

export function editSpecs(id, params) { //规格属性 - 编辑
  return request({
    url: '/serviceSpecAttr/' + id,
    method: 'PATCH',
    data: params
  })
}
