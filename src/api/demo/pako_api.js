// 后台请求封装
import request from '@/utils/request'
// URL序列化
import qs from 'qs'
// Form Data 格式
const ContentTypeFormData = {'Content-Type': 'application/x-www-form-urlencoded'};
export default {
  test: async function (data) {
    return request({
      headers: ContentTypeFormData,
      url: '/api/test',
      method: 'post',
      data: data
    })
  },
  test2: async function (data) {
    return request({
      headers: ContentTypeFormData,
      url: '/api/test',
      method: 'post',
      data: qs.stringify(data)
    })
  },
}