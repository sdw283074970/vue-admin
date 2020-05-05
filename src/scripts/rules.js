const inboundOrderCreateRules = {
  container: [
    { required: true, message: 'Please input container number', trigger: 'change' }
  ],
  customerCode: [
    { required: true, message: 'Please select customer code', trigger: 'change' }
  ],
  eta: [
    { required: true, message: 'Please select a date', trigger: 'change' }
  ],
  originalPlts: [
    { required: true, message: 'Please input the original Plts', trigger: 'change' }
  ],
  inboundType: [
    { required: true, message: 'Please select inbound type', trigger: 'change' }
  ],
  unloadingType: [
    { required: true, message: 'Please select unloading type', trigger: 'change' }
  ],
  storageType: [
    { required: true, message: 'Please select storage type', trigger: 'change' }
  ],
  palletizing: [
    { required: true, message: 'Please select palletizing', trigger: 'change' }
  ],
  carrier: [
    { required: true, message: 'This filed is required', trigger: 'change' }
  ],
  containerSize: [
    { required: true, message: 'This filed is required', trigger: 'change' }
  ]
}

export { inboundOrderCreateRules }
