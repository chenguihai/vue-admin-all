import request from '@/utils/request'

export function deleteUnit(id) {
    return request({
        url: '/serviceUnit/' + id,
        method: 'DELETE',
    })
}


export function unitList(page) {
    return request({
        url: '/serviceUnit?page=' + page,
        method: 'get',
    })
}

export function addUnit(data) {
    return request({
        url: '/serviceUnit',
        method: 'POST',
        data: data
    })
}

export function editUnit(id, data) {
    return request({
        url: '/serviceUnit/' + id,
        method: 'PATCH',
        data: data
    })
}