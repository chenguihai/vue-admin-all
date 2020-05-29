import request from '@/utils/request'

export function journal(type, data) { //上刊画面管理 - 列表
  return request({
    url: '/journal/' + type,
    method: 'get',
    params: data
  })
}

export function journalBatch(param) { //上刊画面管理 - 上下架
  return request({
    url: '/journalBatch',
    method: 'post',
    data: param
  })
}

export function journalCheck(id, param) { //上刊画面管理 - 编辑
  return request({
    url: '/journalCheck/' + id,
    method: 'post',
    data: param
  })
}

