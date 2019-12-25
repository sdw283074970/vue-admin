<template>
  <div class="gb-maincontainer">
    <receiving-wo-sum :master-order="masterOrder" :step="step" />
    <receiving-wo-control
      :master-order="masterOrder"
      :order-details="orderDetails"
      :plt-data="pltData"
      :ctn-date="ctnData"
      :plt-inventory-data="pltInventoryData"
      :ctn-inventory-data="ctnInventoryData"
      @childOrderDetails="refreshOrderDetails"
    />
    <receiving-wo-packinglist :master-order="masterOrder" :order-details="orderDetails" />
    <receiving-wo-instruction :master-order="masterOrder" />
  </div>
</template>

<script>
import { getRO, getOrderDetails, getPallets, getCartons, getPltsInventory, getCtnsInventory } from '@/api/receiving'

export default {
  components: {
    'receiving-wo-sum': () => import('@/views/shareview/receiving/receiving-wo-sum'),
    'receiving-wo-control': () => import('@/views/officeview/receiving/receiving-wo-control'),
    'receiving-wo-packinglist': () => import('@/views/shareview/receiving/receiving-wo-packinglist'),
    'receiving-wo-instruction': () => import('@/views/officeview/receiving/receiving-wo-instructions')
  },
  data() {
    return {
      masterOrder: {},
      orderDetails: [],
      pltData: [],
      ctnData: [],
      pltInventoryData: [],
      ctnInventoryData: [],
      step: 0
    }
  },
  computed: {

  },
  watch: {
    masterOrder: {
      handler: function(newVal, oldVal) {
        const status = this.masterOrder.status
        if (status === 'New Created') { this.step = 1 } else if (status === 'Draft') { this.step = 2 } else if (status === 'Incoming') { this.step = 4 } else if (status === 'Received') { this.step = 5 } else if (status === 'Registered') { this.step = 7 } else if (status === 'Allocated') { this.step = 8 } else if (status === 'Completed') { this.step = 9 } else { this.step = 6 }
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
  },
  methods: {
    refreshOrderDetails(payload) {
      getOrderDetails(payload).then(body => {
        this.orderDetails = body.data
      })
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
