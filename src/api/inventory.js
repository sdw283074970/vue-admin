import request from '@/utils/request-no-interceptor'
// import qs from 'qs'
// import config from '@/scripts/global'

// const baseURL = config.baseURL

export function getInventoryByDate(code, date) {
  return request({
    url: 'api/fba/fbainventoryindex/?customerCode=' + code + '&closeDate=' + date,
    method: 'get'
  })
}

export function getCtnHistories(id) {
  return request({
    url: 'api/fba/FBAinventory/?locationId=' + id + '&locationType=Carton',
    method: 'get'
  })
}

export function getPltHistories(id) {
  return request({
    url: 'api/fba/FBAinventory/?locationId=' + id + '&locationType=Pallet',
    method: 'get'
  })
}

export function downloadInventoryReport(code, date) {
  return request({
    url: 'api/fba/FBAInventoryIndex/?customerCode=' + code + '&closeDate=' + date + '&operation=DownloadFile',
    method: 'get'
  })
}
