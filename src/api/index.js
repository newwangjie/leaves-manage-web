import config from '@/config'
import { filterNull } from '@/utils/DataHandle.js'

// 全局请求插件 Axios
import Axios from 'axios'

var Promise = require('es6-promise').Promise
var axios = Axios.create() // 实例化

const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
axios.defaults.baseURL = baseUrl // 接口请求前缀
axios.defaults.withCredentials = true // 是否跨域
axios.defaults.responseType = 'json' // json
// 设置默认请求头
// axios.defaults.headers = {
//   "Content-Type": "application/json"
// }

axios.defaults.transformResponse = [(data) => {
  return filterNull(data)
}] // `transformResponse` 在请求完成后响应传递给 then/catch 前，允许修改响应数据，函数必须return，function (data) { return data }
// 添加响应拦截器
axios.interceptors.response.use(function (response) { // 请求成功的回调
  return Promise.resolve(response.data)
}, function (error) { // 请求失败的回调
  // if (error.response) { // 请求已发出，但服务器响应的状态码不在 2xx 范围内
  //   console.error(error)
  //   console.log('错误数据: ', error.response)
  // } else { // 在提出请求设置时发生的错误: Something happened in setting up the request that triggered an Error
  //   console.error('Error', error.message)
  // }
  return Promise.reject(error)
})

export default axios
