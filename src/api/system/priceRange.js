import request from '@/utils/request'

export function listReq(data) { //价格区间 - 列表
  return request({
    url: '/priceInterval',
    method: 'get',
    params: data
  })
}

export function addReq(param) { //价格区间 - 新增
  return request({
    url: '/priceInterval',
    method: 'post',
    data: param
  })
}

export function editReq(id, param) { //价格区间 - 编辑
  return request({
    url: '/priceInterval/' + id,
    method: 'patch',
    data: param
  })
}

export function deleteReq(id) { //价格区间 - 删除
  return request({
    url: '/priceInterval/' + id,
    method: 'delete',
  })
}
