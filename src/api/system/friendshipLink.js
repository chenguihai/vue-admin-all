import request from '@/utils/request'

export function requestList(params) { //友情链接 - 列表 / 查询
    return request({
        url: '/blogroll',
        method: 'get',
        params: params
    })
}

export function requestDelete(id) { //友情链接 - 删除
    return request({
        url: '/blogroll/' + id,
        method: 'delete',
    })
}

export function requestShow(id, show) { //友情链接 - 显示
    return request({
        url: '/blogrollShow/' + id + '/' + show,
        method: 'get',
    })
}

export function requestAdd(params) { //友情链接 - 新增
    return request({
        url: '/blogroll',
        method: 'post',
        data: params
    })
}

export function requestEdit(id, params) { //友情链接 - 编辑
    return request({
        url: '/blogroll/' + id,
        method: 'patch',
        data: params
    })
}