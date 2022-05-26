<template>
  <div class="dashboard-editor-container">
    <div class="chart-wrapper">
      <shipping-wo-sum :ship-order="shipOrder" :step="step" />
    </div>
    <div class="chart-wrapper">
      <shipping-wo-control :ship-order="shipOrder" :step="step" @reloadOrder="reloadOrder" @onCallBackClicked="onCallBackClicked" @onCancelOrderClicked="onCancelOrderClicked" />
    </div>
    <div class="chart-wrapper">
      <shipping-wo-picking :ship-order="shipOrder" :step="step" :pick-details="pickDetails" @referashPickDetails="referashPickDetails" />
    </div>
    <div class="chart-wrapper">
      <shipping-wo-instruction :instructions="filteredInstructions" :ship-order="shipOrder" :step="step" @onResetClicked="onResetClicked" @referashInstructions="referashInstructions" />
    </div>
    <div class="chart-wrapper">
      <shipping-wo-operationlogs :logs="logs" :ship-order="shipOrder" />
    </div>
    <div class="chart-wrapper">
      <invoice-detail v-if="checkPermission(['accounting', 'admin', 'office'])" :reference="shipOrder.shipOrderNumber" :order-type="'ShipOrder'" :invoice-status="shipOrder.invoiceStatus" :invoices="invoices" @reloadOrder="reloadOrder" />
    </div>
  </div>
</template>

<script>
import { getSO, getPickDetails, getInstructions, resetInstructions, reverseShipOrderStatus, cancelOrder } from '@/api/shipping'
import { getInvoices } from '@/api/accounting'
import { getShipOrderLogs } from '@/api/dashboard'
import checkPermission from '@/utils/permission' // 权限判断函数

export default {
  components: {
    'shipping-wo-sum': () => import('@/views/shareview/shipping/shipping-wo-sum'),
    'shipping-wo-control': () => import('@/views/officeview/shipping/shipping-wo-control'),
    'shipping-wo-picking': () => import('@/views/officeview/shipping/shipping-wo-picking'),
    'shipping-wo-instruction': () => import('@/views/officeview/shipping/shipping-wo-instructions'),
    'shipping-wo-operationlogs': () => import('@/views/officeview/shipping/shipping-wo-operationlogs'),
    'invoice-detail': () => import('@/views/accountingview/invoice/invoice-detail')
  },
  data() {
    return {
      shipOrder: {},
      pickDetails: [],
      instructions: [],
      invoices: [],
      logs: [],
      step: 0
    }
  },
  computed: {
    today: function() {
      var date = new Date()
      return date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString() + '-' + date.getDate().toString()
    },
    filteredInstructions() {
      if (checkPermission(['trainee']))
        return this.instructions.filter(x => x.visibleToAgent==true);
      else
        return this.instructions
    }
  },
  watch: {
    shipOrder: {
      handler: function(newVal, oldVal) {
        const status = this.shipOrder.status
        if (status === 'New Created') { this.step = 1 } else if (status === 'Picking') { this.step = 1 } else if (status === 'Draft') { this.step = 2 } else if (status === 'New Order') { this.step = 3 } else if (status === 'Ready') { this.step = 5 } else if (status === 'Released') { this.step = 6 } else if (status === 'Shipped') { this.step = 8 } else if (status === 'Cancelled') { this.step = 9 } else { this.step = 4 }
      },
      deep: true
    }
  },
  mounted() {
    const id = this.$route.params.shipOrderId
    getSO(id).then(body => {
      this.shipOrder = body.data
      getInvoices(this.shipOrder.shipOrderNumber, 'ShipOrder').then(res => {
        this.invoices = res.data
      })
    })
    getPickDetails(id).then(body => {
      this.pickDetails = body.data
    })
    getInstructions(id).then(body => {
      this.instructions = body.data.operationInstructions
    })
    getShipOrderLogs(id).then(body => {
      this.logs = body.data
    })
  },
  methods: {
    checkPermission,
    onCancelOrderClicked(cancelDate) {
      cancelOrder(this.shipOrder.shipOrderNumber, cancelDate, 'ShipOrder').then(res => {
        this.reloadOrder()
      })
    },
    onCallBackClicked() {
      reverseShipOrderStatus(this.$route.params.shipOrderId, this.today).then(() => {
        getSO(this.$route.params.shipOrderId).then(body => {
          this.shipOrder = body.data
          this.$message({
            message: 'Recall succeed',
            type: 'success'
          })
        })
      })
    },
    referashPickDetails() {
      getPickDetails(this.$route.params.shipOrderId).then(body => {
        this.pickDetails = body.data
      })
      getShipOrderLogs(this.$route.params.shipOrderId).then(body => {
        this.logs = body.data
      })
    },
    referashInstructions() {
      getInstructions(this.$route.params.shipOrderId).then(body => {
        this.instructions = body.data.operationInstructions
      })
      getShipOrderLogs(this.$route.params.shipOrderId).then(body => {
        this.logs = body.data
      })
    },
    onResetClicked() {
      resetInstructions(this.$route.params.shipOrderId).then(body => {
        getInstructions(this.$route.params.shipOrderId).then(body => {
          this.instructions = body.data.operationInstructions
          this.$message({
            message: 'Reset succeed',
            type: 'success'
          })
        })
      })
    },
    reloadOrder() {
      const id = this.$route.params.shipOrderId
      getSO(id).then(body => {
        this.shipOrder = body.data
      })
      getPickDetails(id).then(body => {
        this.pickDetails = body.data
      })
      getInstructions(id).then(body => {
        this.instructions = body.data.operationInstructions
      })
      getInvoices(this.shipOrder.shipOrderNumber, 'ShipOrder').then(res => {
        this.invoices = res.data
      })
      getShipOrderLogs(id).then(body => {
        this.logs = body.data
      })
      this.$message({
        message: 'Success',
        type: 'success'
      })
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
