<template>
  <div>
    <h2>Control Panel {{ shipOrder.status }}</h2>
    <div style="margin-bottom:10px">
      <el-button :disabled="step>2" class="gb-button" type="primary" @click="onPushClicked">Push WO</el-button>
      <el-button :disabled="step==8||step<3" class="gb-button" type="warning" @click="onCallBackClicked">Recall WO</el-button>
      <el-button :disabled="step!=5" class="gb-button" type="primary" @click="onMarkReleasedClicked">Mark Released</el-button>
      <el-button :disabled="step<3||step>=6" class="gb-button" type="danger" @click="onPushClicked">Push Status</el-button>
      <el-button :disabled="step==8||step<4" class="gb-button" type="danger" @click="onCallBackClicked">Reverse Status</el-button>
    </div>
    <el-dialog
      title="Select Released Date"
      :visible.sync="releaseVisible"
      top="5vh"
      width="250px"
      :lock-scroll="false"
    >
      <el-date-picker v-model="shipOrder.releasedDate" type="date" placeholder="Select Released Date" value-format="yyyy-MM-dd" style="width:200px" />
      <div style="text-align:right">
        <el-popover
          v-model="popVisible"
          placement="bottom"
          width="400"
          style="margin-left:10px"
        >
          <h3 style="color:red">Warnning!</h3>
          <p>This operation is unreversable.</p>
          <p>Are you sure you have logged all the charging notes?</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="popVisible = false">No, I am going to double check it</el-button>
            <el-button type="primary" size="mini" @click="onConfirmReleasedClicked">Yes, I will be responsible for this operation</el-button>
          </div>
          <el-button slot="reference" type="primary">Confirm</el-button>
        </el-popover>
      </div>
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
      releaseVisible: false,
      popVisible: false
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
    onMarkReleasedClicked() {
      this.releaseVisible = true
      this.shipOrder.releasedDate = ''
    },
    onPushClicked() {
      pushShipOrderStatus(this.$route.params.shipOrderId, this.today).then(() => {
        this.$emit('reloadOrder')
      })
    },
    onCallBackClicked() {
      this.$emit('onCallBackClicked')
    },
    onConfirmReleasedClicked() {
      if (this.shipOrder.releasedDate !== '') {
        pushShipOrderStatus(this.$route.params.shipOrderId, this.shipOrder.releasedDate).then(() => {
          this.$emit('reloadOrder')
          this.releaseVisible = false
        })
      } else {
        this.$message({
          message: 'Please select a release date',
          type: 'error'
        })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
