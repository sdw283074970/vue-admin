/* eslint-disable no-unused-vars */
import axios from 'axios'
import config from '@/scripts/global'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: config.baseURL, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000 // request timeout
})

service.interceptors.request.use(
  config => {
    // do something before request is sent
    config.headers['Content-Type'] = 'application/json'
    config.headers['AppUser'] = store.getters.name
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  config => {
    return config
  },
  error => {
    console.log('err' + error.response.data.exceptionMessage) // for debug
    Message({
      message: error.response.data.exceptionMessage,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
