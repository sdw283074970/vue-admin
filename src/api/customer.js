import request from '@/utils/request-no-interceptor'
// import config from '@/scripts/global'

// const baseURL = config.baseURL

export function getCustomerDB() {
  return request({
    url: 'api/fba/fbaindex/',
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

