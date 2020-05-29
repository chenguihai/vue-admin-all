import request from '@/utils/request'

export function imageTag(params) { //上刊画面标签 - 列表
    return request({
        url: '/journalImageTag',
        method: 'get',
        params
    })
}

export function addTag(data) { //上刊画面标签 - 新增
    return request({
        url: '/journalImageTag',
        method: 'post',
        data
    })
}

export function editTag(id, data) { //上刊画面标签 - 编辑
    return request({
        url: '/journalImageTag/' + id,
        method: 'patch',
        data
    })
}

export function deleteTag(id) { //上刊画面标签 -  删除
    return request({
        url: '/journalImageTag/' + id,
        method: 'delete',
    })
}