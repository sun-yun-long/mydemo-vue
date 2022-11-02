import request from '@/utils/request'

/**
 * 通用报告接口
 * @param {*} data 入参字段
 * @returns 
 */
const list = (data) => {
  return request({
    url: '/api/home',
    method: 'GET',
    params: {
      ...data
    }
  })
}



export default {
  list
}