<template>
  <div>
    <h2>Control Panel {{ shipOrder.status }}</h2>
    <div style="margin-bottom:10px">
      <el-button :loading="loading" :disabled="step>2" class="gb-button" type="primary" @click="onPushClicked">Push WO</el-button>
      <el-button class="gb-button" :loading="loading" :disabled="step<3" type="primary" @click="onSwitchClicked">Switch to Warehouse</el-button>
      <el-button :loading="loading" :disabled="step==8||step<3" class="gb-button" type="warning" @click="onCallBackClicked">Recall WO</el-button>
      <el-button :loading="loading" :disabled="step!=5" class="gb-button" type="primary" @click="onMarkReleasedClicked">Mark Released</el-button>
      <el-button :loading="loading" :disabled="true" class="gb-button" type="danger" @click="onQuickPushClicked">Push Status</el-button>
      <!-- <el-button :loading="loading" :disabled="step<3||step>=6" class="gb-button" type="danger" @click="onQuickPushClicked">Push Status</el-button> -->
      <el-button :loading="loading" :disabled="step==8||step<4" class="gb-button" type="danger" @click="onCallBackClicked">Reverse Status</el-button>
    </div>
    <el-dialog
      title="Select Released Date"
      :visible.sync="releaseVisible"
      top="5vh"
      width="250px"
      :lock-scroll="false"
    >
      <el-date-picker v-model="releasedDate" type="date" placeholder="Select Released Date" value-format="yyyy-MM-dd" style="width:200px" />
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
    <el-dialog
      title="Select Push Date"
      :visible.sync="pushVisible"
      top="5vh"
      width="250px"
      :lock-scroll="false"
    >
      <el-date-picker v-model="placeTime" type="date" placeholder="Select Push Date" value-format="yyyy-MM-dd" style="width:200px" />
      <div style="text-align:right">
        <el-popover
          v-model="popVisible2"
          placement="bottom"
          width="400"
          style="margin-left:10px"
        >
          <h3 style="color:red">Warnning!</h3>
          <p>This push date is very crucial to inventory.</p>
          <p>Are you sure the date above is correct?</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="popVisible2 = false">No, I am going to double check it</el-button>
            <el-button type="primary" size="mini" @click="onConfirmPushClicked">Yes, I will be responsible for this operation</el-button>
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
      popVisible: false,
      popVisible2: false,
      loading: false,
      placeTime: '',
      releasedDate: ''
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
        this.recallVisible = false
      } else if (val >= 2 && val < 6) {
        this.recallVisible = true
      } else {
        this.recallVisible = false
      }
    }
  },
  mounted() {

  },
  methods: {
    onSwitchClicked() {
      this.$router.push({ path: '/warehouse-shipping/shipping-wo/' + this.shipOrder.id })
    },
    onMarkReleasedClicked() {
      this.releaseVisible = true
      this.releasedDate = ''
    },
    onPushClicked() {
      this.pushVisible = true
      this.placeTime = ''
    },
    onConfirmPushClicked() {
      this.loading = true
      if (this.placeTime === '') {
        this.loading = false
        this.$message({
          message: 'Push Date cannot be empty.',
          type: 'error'
        })
      } else {
        pushShipOrderStatus(this.$route.params.shipOrderId, this.placeTime).then(() => {
          this.loading = false
          this.pushVisible = false
          this.popVisible2 = false
          this.$emit('reloadOrder')
        })
      }
    },
    onCallBackClicked() {
      this.loading = true
      this.$emit('onCallBackClicked')
      this.loading = false
    },
    onQuickPushClicked() {
      this.$message({
        message: '发现此功能被大量滥用。暂时移除。',
        type: 'error'
      })
    },
    onConfirmReleasedClicked() {
      this.loading = true
      if (this.releasedDate !== '') {
        pushShipOrderStatus(this.$route.params.shipOrderId, this.releasedDate).then(() => {
          this.$emit('reloadOrder')
          this.loading = false
          this.releaseVisible = false
          this.popVisible = false
        })
      } else {
        this.loading = false
        this.$message({
          message: 'Please select a release date.',
          type: 'error'
        })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
