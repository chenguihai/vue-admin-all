import request from '@/utils/request'

export function fetchList(params) {
    return request({
        url: '/user',
        method: 'GET',
        params: params
    })
}

export function deleteApply(params) {
    return request({
        url: '/userBatch',
        method: 'POST',
        params: params
    })
}

export function updateStatus(param) {
    return request({
        url: '/userStatus/' + param.id + '/' + param.status,
        method: 'GET'
    })
}

//资金详情api
export function accountDetail(id, params) {
    return request({
        url: '/accountDetail/' + id,
        method: 'GET',
        params: params
    })
}

//用户详情api
export function userDetail(id) {
    return request({
        url: '/userDetail/' + id,
        method: 'GET'
    })
}
//用户邀请明细
export function inviteDetail(id, params) {
    return request({
        url: '/inviteDetail/' + id,
        method: 'GET',
        params
    })
}