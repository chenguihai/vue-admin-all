import request from '@/utils/request'

export function serveList(params) { //地址库 - 列表
  return request({
    url: '/cityList',
    method: 'get',
    params: params
  })
}

export function addserve(params) { //地址库 - 新增
  return request({
    url: '/cityList',
    method: 'post',
    data: params
  })
}

export function editserve(id, params) { //地址库 - 编辑
  return request({
    url: '/cityList/' + id,
    method: 'patch',
    data: params
  })
}

export function statusServe(id, status) { //地址库 - 是否显示
  return request({
    url: `/cityStatus/${id}/${status}`,
    method: 'get',
  })
}

export function parentAddrServe(level) { //地址库 - 上级地址
  return request({
    url: `/getParentAddr/${level}`,
    method: 'get',
  })
}
