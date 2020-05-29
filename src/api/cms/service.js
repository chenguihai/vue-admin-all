import request from '@/utils/request'

export function serviceList(params) { //服务 - 列表 / 查询
  return request({
    url: '/service',
    method: 'get',
    params: params
  })
}

export function serviceBatch(params) { //服务 - 单个 / 批量操作
  return request({
    url: '/serviceBatch',
    method: 'post',
    data: params
  })
}
