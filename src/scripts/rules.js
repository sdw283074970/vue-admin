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
  ],
  warehouseLocation: [
    { required: true, message: 'This filed is required', trigger: 'change' }
  ]
}

export { inboundOrderCreateRules }

const outboundOrderCreateRules = {
  shipOrderNumber: [
    { required: true, message: 'Please input ship order number', trigger: 'change' }
  ],
  customerCode: [
    { required: true, message: 'Please select customer code', trigger: 'change' }
  ],
  ets: [
    { required: true, message: 'Please select a date', trigger: 'change' }
  ],
  etsTimeRange: [
    { required: true, message: 'Please specify the truck arrival time range', trigger: 'change' }
  ],
  destination: [
    { required: true, message: 'Please specify the arrival destination', trigger: 'change' }
  ],
  carrier: [
    { required: true, message: 'Please specify the carrier', trigger: 'change' }
  ],
  warehouseLocation: [
    { required: true, message: 'This filed is required', trigger: 'change' }
  ]
}

export { outboundOrderCreateRules }
