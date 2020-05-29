import request from '@/utils/request'

export function mediaType(params) { //上刊媒体类型 - 列表
    return request({
        url: '/journalMediaType',
        method: 'get',
        params
    })
}

export function addType(data) { //上刊媒体类型 - 新增
    return request({
        url: '/journalMediaType',
        method: 'post',
        data
    })
}

export function editType(id, data) { //上刊媒体类型 - 编辑
    return request({
        url: '/journalMediaType/' + id,
        method: 'patch',
        data
    })
}

export function deleteType(id) { //上刊媒体类型 -  删除
    return request({
        url: '/journalMediaType/' + id,
        method: 'delete',
    })
}