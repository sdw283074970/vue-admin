<template>
  <div>
    <h2>Control Panel {{ shipOrder.status }}</h2>
    <div style="margin-bottom:10px">
      <!-- <el-button :disabled="step>2" class="gb-button" type="primary" @click="onPushClicked">Push WO</el-button>
      <el-button :disabled="step==7||step<3" class="gb-button" type="warning" @click="onCallBackClicked">Recall WO</el-button>
      <el-button :disabled="step!=5" class="gb-button" type="primary" @click="onMarkReleasedClicked">Mark Released</el-button>
      <el-button :disabled="step<3||step==6" class="gb-button" type="danger" @click="onPushClicked">Push Status</el-button>
      <el-button :disabled="step==7||step<4" class="gb-button" type="danger" @click="onCallBackClicked">Reverse Status</el-button> -->
      <div>
        <el-button class="gb-button" :disabled="step!=3" type="success" @click="onStartClicked">Start</el-button>
        <el-button class="gb-button" :disabled="step!=4" type="success" @click="onFinishProcessingClicked">Finish Processing</el-button>
        <el-button class="gb-button" :disabled="step!=4&&step!=5" type="info" @click="onResetStatusClicked">Reset Order Status</el-button>
      </div>
    </div>
    <el-dialog
      title="Processing Report"
      :visible.sync="reportVisible"
      top="5vh"
      width="400px"
      :lock-scroll="false"
    >
      <process-report :ship-order="shipOrder" :report="report" @onOperationSuccess="onOperationSuccess" />
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable vue/require-prop-type-constructor */
/* eslint-disable vue/require-default-prop */
/* eslint-disable vue/require-prop-types */
import { pushShipOrderStatus, updateOrder } from '@/api/shipping'

export default {
  components: {
    'process-report': () => import('@/views/shareview/generic/generic-shipping-report')
  },
  props: {
    shipOrder: {},
    step: 0
  },
  data() {
    return {
      pushVisible: false,
      recallVisible: false,
      releaseVisible: false,
      reportVisible: false,
      report: {
        startedTime: '',
        readyTime: '',
        confirmedBy: '',
        placeTime: '',
        pickMan: '',
        lot: ''
      }
    }
  },
  computed: {
    today: function() {
      var date = new Date()
      return date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString() + '-' + date.getDate().toString()
    }
  },
  watch: {
    step: function(val) {
      if (val === 1) {
        this.pushVisible = true
        this.recallVisible = false
      } else if (val >= 2 && val < 6) {
        this.pushVisible = false
        this.recallVisible = true
      } else {
        this.pushVisible = false
        this.recallVisible = false
      }
    }
  },
  mounted() {

  },
  methods: {
    onOperationSuccess() {
      this.reportVisible = false
      this.$emit('reloadOrder')
    },
    onStartClicked() {
      pushShipOrderStatus(this.$route.params.shipOrderId, this.today).then(() => {
        this.$emit('reloadOrder')
      })
    },
    onFinishProcessingClicked() {
      this.reportVisible = true
    },
    onResetStatusClicked() {
      updateOrder(this.shipOrder.id, 'Reset', {}).then(() => {
        this.$emit('reloadOrder')
      })
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
