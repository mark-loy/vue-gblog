import request from '@/utils/request'

const BASE_API = 'blog/article/detail'

export default {
  /* 获取文章详情数据 */
  getArticleDetail(aid) {
    return request({
      method: 'get',
      url: `${BASE_API}/${aid}`
    })
  }

}