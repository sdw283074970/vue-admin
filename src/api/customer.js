import request from '@/utils/request-no-interceptor'
// import config from '@/scripts/global'

// const baseURL = config.baseURL

export function getCustomerDB() {
  return request({
    url: 'api/fba/fbaindex/',
    method: 'get'
  })
}

export function GetAllCustomerInfoUrl()
{
  return request({
    url: 'api/fba/fbaindex/?operation=INSTOCKCUSTOMER',
    method: 'get'
  })
}

export function createCustomer(data) {
  return request({
    url: 'api/customermanagement/',
    method: 'post',
    data: data
  })
}

export function updateCustomer(data) {
  return request({
    url: 'api/customermanagement/',
    method: 'put',
    data: data
  })
}

export function linkToUser(linkForm) {
  return request({
    url: 'api/customermanagement/?customerId=' + linkForm.id + '&userAccount=' + encodeURIComponent(linkForm.email),
    method: 'put'
  })
}

export function getInstructionTemplates(id) {
  return request({
    url: 'api/customermanagement/?customerId=' + id,
    method: 'get'
  })
}

export function getInstructionTemplate(id) {
  return request({
    url: 'api/customermanagement/?templateId=' + id,
    method: 'get'
  })
}

export function createNewInstructionTemplate(id, data) {
  return request({
    url: 'api/customermanagement/?customerId=' + id,
    method: 'post',
    data: data
  })
}

export function updateInstructionTemplate(id, data) {
  return request({
    url: 'api/customermanagement/?templateId=' + id,
    method: 'put',
    data: data
  })
}

export function deleteInstructionTemplate(id) {
  return request({
    url: 'api/customermanagement/?instructionId=' + id,
    method: 'delete'
  })
}

export function getCustomerServices(id) {
  return request({
    url: 'api/chargingitemmanagement/?customerId=' + id,
    method: 'get'
  })
}

export function createNewService(data) {
  return request({
    url: 'api/chargingitemmanagement/',
    method: 'post',
    data: data
  })
}

export function getService(id) {
  return request({
    url: 'api/chargingitemmanagement/?itemId=' + id,
    method: 'get'
  })
}

export function updateService(id, data) {
  return request({
    url: 'api/chargingitemmanagement/?itemId=' + id,
    method: 'put',
    data: data
  })
}

export function deleteService(id) {
  return request({
    url: 'api/chargingitemmanagement/?itemId=' + id,
    method: 'delete'
  })
}

export function getCustomerStoragePriceTable(id) {
  return request({
    url: 'api/fba/chargetemplate/?customerId=' + id,
    method: 'get'
  })
}

export function getCustomerStoragePriceTableByCustomerCode(code) {
  return request({
    url: 'api/fba/chargetemplate/?customerCode=' + code,
    method: 'get'
  })
}

export function createNewStorageTemp(name, code, unit, currency) {
  return request({
    url: 'api/fba/chargetemplate/?templateName=' + encodeURIComponent(name) + '&customer=' + code + '&timeunit=' + unit + '&currency=' + currency,
    method: 'post'
  })
}

export function getStorageTemp(id) {
  return request({
    url: 'api/fba/chargetemplate/?storageTempId=' + id,
    method: 'get'
  })
}

export function updateStorageTemp(id, name, code, unit, currency) {
  return request({
    url: 'api/fba/chargetemplate/?storageTempId=' + id + '&templateName=' + encodeURIComponent(name) + '&customer=' + code + '&timeunit=' + unit + '&currency=' + currency,
    method: 'put'
  })
}

export function deleteStorageTemp(id) {
  return request({
    url: 'api/fba/chargetemplate/?templateId=' + id,
    method: 'delete'
  })
}

export function getTempDetails(id) {
  return request({
    url: 'api/fba/chargemethod/?templateId=' + id,
    method: 'get'
  })
}

export function createNewLadder(id, from, to, fee) {
  return request({
    url: 'api/fba/chargemethod/?templateId=' + id + '&from=' + from + '&to=' + to + '&fee=' + fee,
    method: 'post'
  })
}

export function deleteStorageDetail(id) {
  return request({
    url: 'api/fba/chargemethod/?methodId=' + id,
    method: 'delete'
  })
}

export function updateLadder(id, from, to, fee) {
  return request({
    url: 'api/fba/chargemethod/?methodId=' + id + '&from=' + from + '&to=' + to + '&fee=' + fee,
    method: 'put'
  })
}

export function changePassword(email, old, psw) {
  return request({
    url: 'api/users/?email=' + encodeURIComponent(email) + '&oldPassword=' + encodeURIComponent(old) + '&password=' + encodeURIComponent(psw),
    method: 'put'
  })
}

export function swithCustomerStatus(id) {
  return request({
    url: 'api/customermanagement/?customerId=' + id + '&operation=Switch',
    method: 'put'
  })
}

export function getAppKeyInfo(email) {
  return request({
    url: 'api/customermanagement/?email=' + email,
    method: 'get'
  })
}
