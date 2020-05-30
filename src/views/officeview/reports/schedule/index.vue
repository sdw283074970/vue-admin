<template>
  <div class="dashboard-editor-container">
    <h1>Schedules</h1>
    <div class="chart-wrapper">
      <h2>Inbound & Outbound Schedule Log</h2>
      <schedule-inbound-outbound />
    </div>
  </div>
</template>

<script>
// import { getReceivingOrdersByCustomerCode, createNewrReceivingOrder, getReceivingOrderInfo, updateReceivingOrderInfo, downloadFile } from '@/api/receiving'
// import { getShippingOrders, getCustomerCodes, getAddressCode, getShipOrderInfo, createNewShipOrder, updateShipOrderInfo } from '@/api/shipping'
// import { generateInvoiceByCustomerCode } from '@/api/accounting'
// import store from '@/store'

// const customerCode = store.getters.customerCode;

export default {
  components: {
    'schedule-inbound-outbound': () => import('@/views/officeview/reports/schedule/schedule-inbound-outbound')
  },
  data() {
    return {
      activeNames: [],
      customerCodeOptions: []
    }
  },
  computed: {
  },
  watch: {
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
    .input-bar{
      text-align: right
    }
</style>
