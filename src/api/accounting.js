import request from '@/utils/request-no-interceptor'
// import qs from 'qs'
// import config from '@/scripts/global'

export function getInvoices(reference, orderType) {
  return request({
    url: 'api/fbainvoicedetail/?reference=' + reference + '&invoiceType=' + orderType,
    method: 'get'
  })
}

export function updateInvoiceStatus(id, type) {
  return request({
    url: 'api/fbainvoicedetail/?invoiceDetailId=' + id + '&buttonType=' + type,
    method: 'put'
  })
}
