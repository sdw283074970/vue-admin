<template>
  <div class="dashboard-editor-container">
    <div class="chart-wrapper">
      <receiving-wo-sum :master-order="masterOrder" :step="step" />
    </div>
    <div class="chart-wrapper">
      <receiving-wo-packinglist :master-order="masterOrder" :step="step" :order-details="orderDetails" @onAddClicked="onAddClicked" />
    </div>
    <div class="chart-wrapper">
      <receiving-wo-instruction :master-order="masterOrder" :instructions="instructions" />
    </div>
    <div class="chart-wrapper">
      <inbound-wo-operation
        :master-order="masterOrder"
        :order-details="orderDetails"
        :plt-data="pltData"
        :ctn-date="ctnData"
        :plt-inventory-data="pltInventoryData"
        :ctn-inventory-data="ctnInventoryData"
        @childOrderDetails="refreshOrderDetails"
      />
    </div>
  </div>
</template>

<script>
import { getRO, getOrderDetails, getPallets, getCartons, getPltsInventory, getCtnsInventory, getInstructions } from '@/api/receiving'

export default {
  components: {
    'receiving-wo-sum': () => import('@/views/shareview/receiving/receiving-wo-sum'),
    'inbound-wo-operation': () => import('@/views/customerview/inbound/inbound-wo-operation'),
    'receiving-wo-packinglist': () => import('@/views/shareview/receiving/receiving-wo-packinglist'),
    'receiving-wo-instruction': () => import('@/views/customerview/inbound/inbound-wo-instructions')
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
      step: 0
    }
  },
  computed: {

  },
  watch: {
    masterOrder: {
      handler: function(newVal, oldVal) {
        const status = this.masterOrder.status
        if (status === 'New Created') { this.step = 1 } else if (status === 'Draft') { this.step = 2 } else if (status === 'Incoming') { this.step = 3 } else if (status === 'Arrived') { this.step = 4 } else if (status === 'Received') { this.step = 6 } else if (status === 'Registered') { this.step = 7 } else if (status === 'Allocated') { this.step = 8 } else if (status === 'Completed') { this.step = 9 } else { this.step = 5 }
      },
      deep: true
    }
  },
  mounted() {
    const id = this.$route.params.masterOrderId
    getRO(id).then(body => {
      this.masterOrder = body.data
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
    getInstructions(this.$route.params.masterOrderId).then(body => {
      this.instructions = body.data.operationInstructions
    })
  },
  methods: {
    refreshOrderDetails(payload) {
      getOrderDetails(payload).then(body => {
        this.orderDetails = body.data
      })
    },
    onAddClicked(data) {
      this.orderDetails.push(data)
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
