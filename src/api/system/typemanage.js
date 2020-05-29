import request from '@/utils/request'

export function typeList(params) {

    return request({
        url: '/category',
        method: 'get',
        params: params
    })
}

export function catecut() {
    return request({
        url: '/cateCut',
        method: 'get'
    })
}

export function addmanage(params) {
    return request({
        url: '/category',
        method: 'post',
        data: params
    })
}

export function edittype(id, params) {
    return request({
        url: '/category/' + id,
        method: 'patch',
        data: params
    })
}

export function settleStatus(id, status) { //是否开启结算申请
    return request({
        url: `/settleStatus/${id}/${status}`,
        method: 'get',
    })
}

export function editstatus(params) {
    return request({
        url: '/indexNeedsShow/' + params.id + '/' + params.show,
        method: 'GET',
    })
}