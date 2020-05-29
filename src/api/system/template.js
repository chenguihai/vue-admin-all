import request from '@/utils/request'

// get
export function templateList(params) { //模板 - 列表 / 查询
  return request({
    url: '/template',
    method: 'get',
    params: params
  })
}

export function templateShow(id, open) { //模板 - 开启
  return request({
    url: '/templateShow/' + id + '/' + open,
    method: 'get'
  })
}

// post
export function addTemplate(params) { //模板 - 新增
  return request({
    url: '/template',
    method: 'post',
    data: params
  })
}

export function editTemplate(params, id) { //模板 -编辑
  return request({
    url: '/template/' + id,
    method: 'patch',
    data: params
  })
}

export function deleteTemplate(id) { //模板 - 删除
  return request({
    url: '/template/' + id,
    method: 'delete'
  })
}
