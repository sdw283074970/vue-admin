<template>
  <div id="csr-receiving-wo-control">
    <h2>Control Panel</h2>
    <div style="margin-bottom:10px">
      <div>
        <el-button id="csr-receiving-wo-push" :loading="loading" class="gb-button" type="primary" :disabled="step>2" @click="onPushClicked">Push WO</el-button>
        <el-button class="gb-button" :loading="loading" :disabled="step<4||step>8" type="primary" @click="onSwitchClicked">Switch to Warehouse</el-button>
        <el-button id="csr-receiving-wo-recall" :loading="loading" class="gb-button" type="warning" :disabled="step!=3&&step!=4" @click="onRecallClicked">Recall WO</el-button>
        <el-button id="csr-receiving-wo-arrive" :loading="loading" :disabled="step<3" class="gb-button" type="primary" @click="arrivedVisible=true">Mark Arrived</el-button>
        <el-button class="gb-button" :loading="loading" :disabled="step!=4||masterOrder.storageType!='E-COMMERCE'" type="primary" @click="onAutoReceiveClicked">Auto Receive</el-button>
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
            <el-button type="primary" size="mini" @click="onCompletedClicked">Yes, I will be responsible for this operation</el-button>
          </div>
          <el-button id="csr-receiving-wo-complete" slot="reference" class="gb-button" :disabled="step!=8&&(step!=4||masterOrder.storageType!='E-COMMERCE')" type="primary">Mark Completed</el-button>
        </el-popover>
        <el-button id="all-receiving-wo-summary-inventory" type="info" class="gb-button" style="margin-left:10px" @click="inventoryVisible = true">View Inventory</el-button>
        <el-button icon="el-icon-info" @click.prevent.stop="guide">Guide</el-button>
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
/* eslint-disable vue/require-prop-types */
/* eslint-disable vue/require-default-prop */
import { pushMasterOrder, recallMasterOrder, setInboundDate, changeOrderStatus, autoReceive } from '@/api/receiving'
import { csr_receiving_wo_control } from '@/guide/steps'

export default {
  components: {
    'receiving-register': () => import('@/views/shareview/receiving/receiving-wo-register'),
    'receiving-allocate': () => import('@/views/shareview/receiving/receiving-wo-allocate'),
    'receiving-inventory': () => import('@/views/shareview/receiving/receiving-wo-inventory')
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
      driver: null,
      registerVisible: false,
      allocateVisible: false,
      inventoryVisible: false,
      arrivedVisible: false,
      popVisible: false,
      popVisible2: false,
      pushVisible: false,
      loading: false,
      arrivedTime: '',
      placeTime: ''
    }
  },
  mounted() {
    this.driver = new this.$driver()
  },
  methods: {
    onPushClicked() {
      this.placeTime = ''
      this.pushVisible = true
    },
    onConfirmPushClicked() {
      this.loading = true
      if (this.placeTime !== '') {
        pushMasterOrder(this.masterOrder.id, this.placeTime).then(() => {
          this.masterOrder.status = 'Incoming'
          this.popVisible2 = false
          this.pushVisible = false
          this.masterOrder.pushTime = this.placeTime
          this.$message({
            message: 'Push success',
            type: 'success'
          })
        })
      } else {
        this.$message({
          message: 'Push Date cannot be empty.',
          type: 'error'
        })
      }
      this.loading = false
    },
    guide() {
      this.driver.defineSteps(csr_receiving_wo_control)
      this.driver.start()
    },
    onRecallClicked() {
      recallMasterOrder(this.masterOrder.id).then(() => {
        this.masterOrder.status = 'New Created'
        this.$message({
          message: 'Recall success',
          type: 'success'
        })
      })
    },
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
    onAllocateClicked() {
      this.allocateVisible = true
      this.$emit('refreshPackingList')
    },
    onCompletedClicked() {
      changeOrderStatus(this.masterOrder.id, 'Confirmed').then(body => {
        this.masterOrder.status = 'Confirmed'
        this.popVisible = false
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
    onSwitchClicked() {
      this.$router.push({ path: '/warehouse-receiving/receiving-wo/' + this.masterOrder.id })
    },
    reloadOrder() {
      this.$emit('reloadOrder')
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
