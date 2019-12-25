<template>
  <div class="gb-maincontainer">
    <shipping-wo-sum :ship-order="shipOrder" :step="step" />
    <shipping-wo-picking :ship-order="shipOrder" :step="step" :pick-details="pickDetails" @referashPickDetails="referashPickDetails" />
    <shipping-wo-instruction :instructions="instructions" :ship-order="shipOrder" @onResetClicked="onResetClicked" @onDeleteClicked="onDeleteClicked" @referashInstructions="referashInstructions" />
    <shipping-wo-control :ship-order="shipOrder" :step="step" @onPushClicked="onPushClicked" @onCallBackClicked="onCallBackClicked" />
  </div>
</template>

<script>
import { getSO, getPickDetails, getInstructions, resetInstructions, deleteInstruction, pushShipOrderStatus, reverseShipOrderStatus } from '@/api/shipping'

export default {
  components: {
    'shipping-wo-sum': () => import('@/views/shareview/shipping/shipping-wo-sum'),
    'shipping-wo-control': () => import('@/views/customerview/outbound/outbound-wo-control'),
    'shipping-wo-picking': () => import('@/views/customerview/outbound/outbound-wo-picking'),
    'shipping-wo-instruction': () => import('@/views/customerview/outbound/outbound-wo-instructions')
  },
  data() {
    return {
      shipOrder: {},
      pickDetails: [],
      instructions: [],
      step: 0
    }
  },
  computed: {
    today: function() {
      var date = new Date()
      return date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString() + '-' + date.getDate().toString()
    }
  },
  watch: {
    shipOrder: {
      handler: function(newVal, oldVal) {
        const status = this.shipOrder.status
        if (status === 'New Created') { this.step = 1 } else if (status === 'Picking') { this.step = 1 } else if (status === 'Draft') { this.step = 2 } else if (status === 'New Order') { this.step = 3 } else if (status === 'Ready') { this.step = 4 } else if (status === 'Released') { this.step = 6 } else if (status === 'Shipped') { this.step = 8 } else { this.step = 4 }
      },
      deep: true
    }
  },
  mounted() {
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
  },
  methods: {
    onPushClicked() {
      pushShipOrderStatus(this.$route.params.shipOrderId, this.today).then(() => {
        getSO(this.$route.params.shipOrderId).then(body => {
          this.shipOrder = body.data
          this.$message({
            message: 'Push succeed',
            type: 'success'
          })
        })
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
    },
    referashInstructions() {
      getInstructions(this.$route.params.shipOrderId).then(body => {
        this.instructions = body.data.operationInstructions
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
    onDeleteClicked(id) {
      deleteInstruction(id).then(() => {
        getInstructions(this.$route.params.shipOrderId).then(body => {
          this.instructions = body.data.operationInstructions
        })
        this.$message({
          message: 'Delete succeed',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
