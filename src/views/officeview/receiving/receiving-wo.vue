<template>
  <div class="dashboard-editor-container">
    <div class="chart-wrapper">
      <receiving-wo-sum :master-order="masterOrder" :order-details="orderDetails" :step="step" />
    </div>
    <div class="chart-wrapper">
      <receiving-wo-control
        :master-order="masterOrder"
        :order-details="orderDetails"
        :plt-data="pltData"
        :ctn-data="ctnData"
        :step="step"
        :plt-inventory-data="pltInventoryData"
        :ctn-inventory-data="ctnInventoryData"
        @childOrderDetails="refreshOrderDetails"
        @refreshPackingList="refreshPackingList"
        @reloadOrder="reloadOrder"
      />
    </div>
    <div class="chart-wrapper">
      <receiving-wo-packinglist :master-order="masterOrder" :order-details="orderDetails" :step="step" />
    </div>
    <div class="chart-wrapper">
      <receiving-wo-instruction :master-order="masterOrder" :instructions="filteredInstructions" :step="step" @referashInstructions="referashInstructions" @onResetClicked="onResetClicked" />
    </div>
    <div class="chart-wrapper">
      <invoice-detail v-if="checkPermission(['accounting', 'admin', 'office'])" :reference="masterOrder.container" :order-type="'MasterOrder'" :invoice-status="masterOrder.invoiceStatus" :invoices="invoices" @reloadOrder="reloadOrder" />
    </div>
  </div>
</template>

<script>
import { getRO, getOrderDetails, getPallets, getCartons, getPltsInventory, getCtnsInventory, getInstructions, resetInstructions } from '@/api/receiving'
import { getInvoices } from '@/api/accounting'
import checkPermission from '@/utils/permission' // 权限判断函数

export default {
  components: {
    'receiving-wo-sum': () => import('@/views/shareview/receiving/receiving-wo-sum'),
    'receiving-wo-control': () => import('@/views/officeview/receiving/receiving-wo-control'),
    'receiving-wo-packinglist': () => import('@/views/shareview/receiving/receiving-wo-packinglist'),
    'receiving-wo-instruction': () => import('@/views/officeview/receiving/receiving-wo-instructions'),
    'invoice-detail': () => import('@/views/accountingview/invoice/invoice-detail')
  },
  data() {
    return {
      masterOrder: {},
      orderDetails: [],
      pltData: [],
      ctnData: [],
      pltInventoryData: [],
      ctnInventoryData: [],
      instructions: [],
      invoices: [],
      step: 0
    }
  },
  computed: {
    filteredInstructions() {
      if (checkPermission(['trainee']))
        return this.instructions.filter(x => x.visibleToAgent==true);
      else
        return this.instructions
    }
  },
  watch: {
    masterOrder: {
      handler: function(newVal, oldVal) {
        const status = this.masterOrder.status
        if (status === 'New Created') { this.step = 1 } else if (status === 'Draft') { this.step = 2 } else if (status === 'Incoming') { this.step = 3 } else if (status === 'Arrived') { this.step = 4 } else if (status === 'Received') { this.step = 6 } else if (status === 'Registered') { this.step = 7 } else if (status === 'Allocated') { this.step = 8 } else if (status === 'Confirmed') { this.step = 9 } else { this.step = 5 }
      },
      deep: true
    }
  },
  mounted() {
    const id = this.$route.params.masterOrderId
    getRO(id).then(body => {
      this.masterOrder = body.data
      getInvoices(this.masterOrder.container, 'MasterOrder').then(ivs => {
        this.invoices = ivs.data
      })
    })
    getOrderDetails(id).then(body => {
      this.orderDetails = body.data
    })
    getPallets(this.$route.params.masterOrderId).then(body => {
      this.pltData = body.data
    })
    getCartons(this.$route.params.masterOrderId).then(body => {
      this.ctnData = body.data
    })
    getPltsInventory(this.$route.params.masterOrderId).then(d => {
      this.pltInventoryData = d.data
    })
    getCtnsInventory(this.$route.params.masterOrderId).then(d => {
      this.ctnInventoryData = d.data
    })
    getInstructions(id).then(body => {
      this.instructions = body.data.operationInstructions
    })
  },
  methods: {
    checkPermission,
    refreshOrderDetails(payload) {
      getOrderDetails(payload).then(body => {
        this.orderDetails = body.data
      })
    },
    referashInstructions() {
      getInstructions(this.$route.params.masterOrderId).then(body => {
        this.instructions = body.data.operationInstructions
      })
    },
    onResetClicked() {
      resetInstructions(this.$route.params.masterOrderId).then(body => {
        getInstructions(this.$route.params.masterOrderId).then(body => {
          this.instructions = body.data.operationInstructions
          this.$message({
            message: 'Reset succeed',
            type: 'success'
          })
        })
      })
    },
    refreshPackingList() {
      getOrderDetails(this.masterOrder.id).then(body => {
        this.orderDetails = body.data
      })
      getPallets(this.$route.params.masterOrderId).then(body => {
        this.pltData = body.data
      })
      getCartons(this.$route.params.masterOrderId).then(body => {
        this.ctnData = body.data
      })
    },
    reloadOrder() {
      getOrderDetails(this.masterOrder.id).then(body => {
        this.orderDetails = body.data
      })
      getPallets(this.$route.params.masterOrderId).then(body => {
        this.pltData = body.data
      })
      getCartons(this.$route.params.masterOrderId).then(body => {
        this.ctnData = body.data
      })
      getPltsInventory(this.$route.params.masterOrderId).then(d => {
        this.pltInventoryData = d.data
      })
      getCtnsInventory(this.$route.params.masterOrderId).then(d => {
        this.ctnInventoryData = d.data
      })
      getRO(this.$route.params.masterOrderId).then(body => {
        this.masterOrder = body.data
        getInvoices(this.masterOrder.container, 'MasterOrder').then(ivs => {
          this.invoices = ivs.data
        })
      })
      this.$message({
        message: 'Success',
        type: 'success'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
    .input-bar{
      text-align: right
    }
</style>
