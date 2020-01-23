<template>
  <div>
    <h2>Control Panel {{ shipOrder.status }}</h2>
    <div style="margin-bottom:10px">
      <el-button :disabled="step>2" class="gb-button" type="primary" @click="onPushClicked">Push WO</el-button>
      <el-button :disabled="step==7||step<3" class="gb-button" type="warning" @click="onCallBackClicked">Recall WO</el-button>
      <el-button :disabled="step!=5" class="gb-button" type="primary" @click="releaseVisible=true">Mark Released</el-button>
      <el-button :disabled="step<3||step==6" class="gb-button" type="danger" @click="onPushClicked">Push Status</el-button>
      <el-button :disabled="step==7||step<4" class="gb-button" type="danger" @click="onCallBackClicked">Reverse Status</el-button>
    </div>
    <el-dialog
      title="Select Released Date"
      :visible.sync="releaseVisible"
      top="5vh"
      width="380px"
      :lock-scroll="false"
    >
      <el-date-picker v-model="shipOrder.releasedDate" type="date" placeholder="Select Released Date" value-format="yyyy-MM-dd" style="width:200px;" />
      <el-button type="primary" @click="onConfirmReleasedClicked">Confirm</el-button>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable vue/require-prop-type-constructor */
/* eslint-disable vue/require-default-prop */
/* eslint-disable vue/require-prop-types */
import { pushShipOrderStatus } from '@/api/shipping'

export default {
  props: {
    shipOrder: {},
    step: 0
  },
  data() {
    return {
      pushVisible: false,
      recallVisible: false,
      releaseVisible: false
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
    onPushClicked() {
      pushShipOrderStatus(this.$route.params.shipOrderId, this.today).then(() => {
        this.$emit('reloadShipOrder')
      })
    },
    onCallBackClicked() {
      this.$emit('onCallBackClicked')
    },
    onConfirmReleasedClicked() {
      pushShipOrderStatus(this.$route.params.shipOrderId, this.shipOrder.releasedDate).then(() => {
        this.$emit('reloadShipOrder')
        this.releaseVisible = false
      })
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
