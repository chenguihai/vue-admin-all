import request from '@/utils/request'

export function clueList(params) { //线索 - 列表 / 查询
  return request({
    url: '/clue',
    method: 'get',
    params: params
  })
}

export function clueClose(id) { //线索 - 关闭
  return request({
    url: `/clueClose/${id}`,
    method: 'get'
  })
}

export function clueCheck(params) { //线索 - 审核
  return request({
    url: '/clueCheck',
    method: 'post',
    data: params
  })
}

export function clueHandle(params) { //线索 - 客服包办
  return request({
    url: '/clueHandle',
    method: 'post',
    data: params
  })
}
