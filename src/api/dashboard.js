import request from '@/utils/request-no-interceptor'
// import config from '@/scripts/global'

// const baseURL = config.baseURL

export function getDashboard(data) {
  return request({
    url: 'api/fba/fbaindex/',
    method: 'get'
  })
}

export function getLinerChart(timeUnit, timeCount) {
  return request({
    url: 'api/fba/chart/?timeUnit=' + timeUnit + '&timeCount=' + timeCount,
    method: 'get'
  })
}
