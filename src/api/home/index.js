import request from '@/utils/request'

export function homeIndex() { //总后台 - 首页
  return request({
    url: '/index',
    method: 'get',
  })
}

export function selectTime(type, ymd) { //总后台 - 首页选择日期
  return request({
    url: `/selectDays/${type}/${ymd}`,
    method: 'get',
  })
}
