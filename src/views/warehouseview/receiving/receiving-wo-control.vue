<template>
  <div>
    <h2>Control Panel</h2>
    <div style="margin-bottom:10px">
      <div>
        <el-button class="gb-button" :disabled="step!=4" type="success" @click="onStartClicked">Start</el-button>
        <el-button class="gb-button" :disabled="step!=5" type="primary" @click="onAutoReceiveClicked">Auto Receive</el-button>
        <el-button class="gb-button" :disabled="step!=5" type="success" @click="onFinishProcessingClicked">Finish Processing</el-button>
        <el-button class="gb-button" :disabled="step<6" type="primary" @click="registerVisible = true">Register Plt</el-button>
        <el-button class="gb-button" :disabled="step!=6" type="success" @click="onFinishPalletizingClicked">Finish Palletizing</el-button>
        <el-button class="gb-button" :disabled="step<7" type="primary" @click="onAllocateClicked">Allocate Location</el-button>
        <el-button class="gb-button" :disabled="step!=7" type="success" @click="onFinishAllocatingClicked">Finish Allocating</el-button>
      </div>
      <div style="margin-top:10px">
        <el-button v-if="step>2" class="gb-button" type="info" @click="arrivedVisible=true">Reset Arrived Date</el-button>
        <el-button class="gb-button" :disabled="step<5" type="info" @click="onResetStatusClicked">Reset Order Status</el-button>
        <el-button class="gb-button" type="info" @click="inventoryVisible = true">View Inventory</el-button>
      </div>
    </div>
    <el-dialog
      title="Register Pallets Info"
      :visible.sync="registerVisible"
      top="5vh"
      width="85%"
      :lock-scroll="false"
    >
      <receiving-register :master-order="masterOrder" :order-details="orderDetails" @reloadOrder="reloadOrder" />
    </el-dialog>
    <el-dialog
      title="Select Arrive Date"
      :visible.sync="arrivedVisible"
      top="5vh"
      width="350px"
      :lock-scroll="false"
    >
      <el-date-picker v-model="arrivedTime" type="date" placeholder="Select Arrive Date" value-format="yyyy-MM-dd" style="width:180px;" />
      <el-button type="primary" @click="onConfirmArrivedTimeClicked">Confirm</el-button>
    </el-dialog>
    <el-dialog
      title="Processing Report"
      :visible.sync="reportVisible"
      top="5vh"
      width="400px"
      :lock-scroll="false"
    >
      <process-report :master-order="masterOrder" :report="report" @onOperationSuccess="onOperationSuccess" />
    </el-dialog>
    <el-dialog
      title="Allocate Location"
      :visible.sync="allocateVisible"
      width="85%"
      top="5vh"
      :lock-scroll="false"
    >
      <receiving-allocate :master-order="masterOrder" :plt-data="pltData" :ctn-data="ctnData" @reloadOrder="reloadOrder" />
    </el-dialog>
    <el-dialog
      title="Inventory"
      :visible.sync="inventoryVisible"
      width="85%"
      top="5vh"
      :lock-scroll="false"
    >
      <receiving-inventory :master-order="masterOrder" :plt-inventory-data="pltInventoryData" :ctn-inventory-data="ctnInventoryData" @reloadOrder="reloadOrder" />
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable vue/require-prop-types */
/* eslint-disable vue/require-default-prop */
import { setInboundDate, changeOrderStatus, autoReceive } from '@/api/receiving'

export default {
  components: {
    'receiving-register': () => import('@/views/shareview/receiving/receiving-wo-register'),
    'receiving-allocate': () => import('@/views/shareview/receiving/receiving-wo-allocate'),
    'receiving-inventory': () => import('@/views/shareview/receiving/receiving-wo-inventory'),
    'process-report': () => import('@/views/shareview/generic/generic-receiving-report')
  },
  props: {
    masterOrder: {},
    orderDetails: Array,
    pltData: Array,
    ctnData: Array,
    pltInventoryData: Array,
    ctnInventoryData: Array,
    step: Number
  },
  data() {
    return {
      registerVisible: false,
      allocateVisible: false,
      inventoryVisible: false,
      arrivedVisible: false,
      reportVisible: false,
      arrivedTime: '',
      report: {
        availableTime: '',
        dockNumber: '',
        inboundDate: '',
        outTime: '',
        unloadFinishTime: '',
        damagedBox: '',
        verifiedBy: ''
      }
    }
  },
  mounted() {

  },
  methods: {
    onConfirmArrivedTimeClicked() {
      if (this.arrivedTime === '') {
        this.$message({
          message: 'Please select an arrived date',
          type: 'error'
        })
      } else {
        setInboundDate(this.masterOrder.id, this.arrivedTime).then(() => {
          this.masterOrder.status = 'Arrived'
          this.arrivedVisible = false
          this.$message({
            message: 'Success!',
            type: 'success'
          })
        })
      }
    },
    onResetStatusClicked() {
      changeOrderStatus(this.masterOrder.id, 'Reset').then(body => {
        this.masterOrder.status = 'Arrived'
        this.$message({
          message: 'Success!',
          type: 'success'
        })
      })
    },
    onStartClicked() {
      changeOrderStatus(this.masterOrder.id, 'Start').then(body => {
        this.masterOrder.status = 'Processing'
        this.masterOrder.unloadStartTime = 'Today'
        this.$message({
          message: 'Success!',
          type: 'success'
        })
      })
    },
    onFinishAllocatingClicked() {
      changeOrderStatus(this.masterOrder.id, 'Finish Allocating').then(body => {
        this.masterOrder.status = 'Allocated'
        this.masterOrder.unloadFinishTime = 'Today'
        this.$message({
          message: 'Success!',
          type: 'success'
        })
      })
    },
    onAutoReceiveClicked() {
      autoReceive(this.masterOrder.id).then(body => {
        this.$emit('refreshPackingList')
        this.$message({
          message: 'Success!',
          type: 'success'
        })
      })
    },
    onFinishProcessingClicked() {
      this.reportVisible = true
      this.report.verifiedBy = this.masterOrder.verifiedBy
      this.report.availableTime = this.masterOrder.availableTime.substring(0, 4) === '1900' ? '' : this.masterOrder.availableTime
      this.report.unloadFinishTime = this.masterOrder.unloadFinishTime.substring(0, 4) === '1900' ? '' : this.masterOrder.unloadFinishTime
      this.report.dockNumber = this.masterOrder.dockNumber
      this.report.outTime = this.masterOrder.outTime.substring(0, 4) === '1900' ? '' : this.masterOrder.outTime
      this.report.inboundDate = this.masterOrder.inboundDate.substring(0, 4) === '1900' ? '' : this.masterOrder.inboundDate
      this.report.damagedBox = this.masterOrder.damagedBox
    },
    onOperationSuccess() {
      this.reportVisible = false
    },
    onAllocateClicked() {
      this.allocateVisible = true
      this.$emit('refreshPackingList')
    },
    onFinishPalletizingClicked() {
      changeOrderStatus(this.masterOrder.id, 'Finish Palletizing').then(body => {
        this.masterOrder.status = 'Registered'
        this.$message({
          message: 'Success!',
          type: 'success'
        })
      })
    },
    reloadOrder() {
      this.$emit('reloadOrder')
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
