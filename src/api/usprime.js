import request from '@/utils/request-no-interceptor'

  export function downloadDNPdf(data) {
    return request({
      url: 'api/dnsender/?operation=DOWNLOAD',
      method: 'post',
      data: data
    })
  }

  export function sendSingleDNPdf(data) {
    return request({
      url: 'api/dnsender/?operation=EMAIL',
      method: 'post',
      data: data
    })
  }

  export function downloadSOAPdf(data) {
    return request({
      url: 'api/soa/?operation=DOWNLOAD',
      method: 'post',
      data: data
    })
  }

  export function sendSOA(data) {
    return request({
      url: 'api/soa/?operation=EMAIL',
      method: 'post',
      data: data
    })
  }


  