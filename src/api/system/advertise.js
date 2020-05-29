import request from '@/utils/request'

export function advertiseList(params) {
  return request({
    url: '/adBanner',
    method: 'get',
    params: params
  })
}

export function addadvertise(params) {
  return request({
    url: '/adBanner',
    method: 'POST',
    data: params
  })
}

export function deleteadverltise(id) {
  return request({
    url: '/adBanner/' + id,
    method: 'DELETE',
  })
}

export function editadvertise(id, params) {
  return request({
    url: '/adBanner/' + id,
    method: 'PATCH',
    data: params
  })
}

export function getPosition() {
  return request({
    url: '/getAllAdPosition',
    method: 'get'
  })
}

export function editstatus(params) {
  return request({
    url: '/adBannerShow/' + params.id + '/' + params.show,
    method: 'get'
  })
}

export function getNickname(mobile) {
  return request({
    url: '/getNickname/' + mobile,
    method: 'get'
  })
}

export function getCateByPosition(id) { //广告 - 获取分类
  return request({
    url: '/getCateByPosition/' + id,
    method: 'get'
  })
}
