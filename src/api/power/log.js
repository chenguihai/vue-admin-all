import request from '@/utils/request'
export function requestLog(params) { //管理员操作日志
    return request({
        url: '/adminLog',
        method: 'get',
        params
    })
}
export function requestWords(params) { //敏感词过滤日志
    return request({
        url: '/sensitiveWordsLog',
        method: 'get',
        params
    })
}