import request from '@/utils/request'

export function caseBiog(type, data) { //案例传记管理 - 列表
  return request({
    url: '/caseBiog/' + type,
    method: 'get',
    params: data
  })
}

export function caseBiogBatch(data) { //案例传记管理 - 上下架
  return request({
    url: '/caseBiogBatch',
    method: 'post',
    data
  })
}

export function caseBiogCheck(id, data) { //案例传记管理 - 审核
  return request({
    url: '/caseBiogCheck/' + id,
    method: 'post',
    data
  })
}

export function downFile(id) { //案例传记购买后下载
  return request({
    url: `/caseBiogDown/${id}`,
    method: 'get',
  })
}
