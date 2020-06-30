<template>
  <div class="dashboard-editor-container">
    <h1>Schedules</h1>
    <div class="chart-wrapper">
      <h2>Inbound & Outbound Schedule Log</h2>
      <schedule-inbound-outbound :customer-code-options="customerCodeOptions" />
    </div>
  </div>
</template>

<script>
// import { getReceivingOrdersByCustomerCode, createNewrReceivingOrder, getReceivingOrderInfo, updateReceivingOrderInfo, downloadFile } from '@/api/receiving'
// import { getShippingOrders, getCustomerCodes, getAddressCode, getShipOrderInfo, createNewShipOrder, updateShipOrderInfo } from '@/api/shipping'
// import { generateInvoiceByCustomerCode } from '@/api/accounting'
// import store from '@/store'
import { getCustomerCodes } from '@/api/shipping'

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
    getCustomerCodes().then(
      body => {
        this.customerCodeOptions = body.data
      }
    )
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
