import request from '@/utils/request'
import qs from "qs"
const list = (params) => {
  return request({
    url: '/api/list',
    method: 'post',
    data: qs.stringify(params)
  })
}

const add = (params) => {
  return request({
    url: '/api/add',
    method: 'post',
    data: qs.stringify(params)
  })
}

const update = (params) => {
  return request({
    url: '/api/update',
    method: 'post',
    data: qs.stringify(params)
  })
}

const _delete = (params) => {
  return request({
    url: '/api/delete',
    method: 'post',
    data: qs.stringify(params)
  })
}

export default {
  list,
  add,
  update,
  _delete
}