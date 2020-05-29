import request from '@/utils/request'

export function clueAppendList(params) { //线索需求补充 - 列表 / 查询
  return request({
    url: '/clueAppend',
    method: 'get',
    params: params
  })
}

export function clueAppendStatus(params) { //线索需求补充 - 审核
  return request({
    url: `/clueAppendStatus`,
    method: 'post',
    data: params
  })
}

export function clueAppendBatch(params) { //线索需求补充 - 批量操作
  return request({
    url: '/clueAppendBatch',
    method: 'post',
    data: params
  })
}

export function serviceAppendList(params) { //服务需求补充 - 列表 / 查询
  return request({
    url: '/serviceAppend',
    method: 'get',
    params: params
  })
}

export function serviceAppendStatus(params) { //服务需求补充 - 审核
  return request({
    url: `/serviceAppendStatus`,
    method: 'post',
    data: params
  })
}

export function serviceAppendBatch(params) { //服务需求补充 - 批量操作
  return request({
    url: '/serviceAppendBatch',
    method: 'post',
    data: params
  })
}
