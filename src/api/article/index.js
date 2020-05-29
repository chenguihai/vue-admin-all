import request from '@/utils/request'

// get
export function articleList(params) { //文章列表 / 查询
  return request({
    url: '/article',
    method: 'get',
    params: params
  })
}

export function articleShow(id, show) { //文章列表 - 显示
  return request({
    url: '/articleShow/' + id + '/' + show,
    method: 'get',
  })
}

// post
export function addArticle(params) { //文章列表 - 新增
  return request({
    url: '/article',
    method: 'post',
    data: params
  })
}

export function editArticle(params, id) { //文章列表 - 编辑
  return request({
    url: '/article/' + id,
    method: 'patch',
    data: params
  })
}

export function deleteArticle(id) { //文章列表 - 删除
  return request({
    url: '/article/' + id,
    method: 'delete'
  })
}


// get
export function articleCateList(params) { //文章分类 - 列表
  return request({
    url: '/articleCate',
    method: 'get',
    params: params
  })
}

export function articleCateShow(id, show) { //文章分类 - 显示
  return request({
    url: '/articleCateShow/' + id + '/' + show,
    method: 'get'
  })
}

export function articleCateCut() { //文章分类 - 精简
  return request({
    url: '/articleCateCut',
    method: 'get'
  })
}

// post
export function addArticleCate(params) { //文章分类 - 新增
  return request({
    url: '/articleCate',
    method: 'post',
    data: params
  })
}

export function editArticleCate(params, id) { //文章分类 - 编辑
  return request({
    url: '/articleCate/' + id,
    method: 'patch',
    data: params
  })
}

export function deleteArticleCate(id) { //文章分类 - 删除
  return request({
    url: '/articleCate/' + id,
    method: 'delete'
  })
}
