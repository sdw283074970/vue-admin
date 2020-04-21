<template>
  <div>
    <h2>Invoice Status & Control Panel</h2>
    <div style="margin-bottom:20px;width:600px">
      <el-steps :active="invoiceStep" finish-status="success">
        <el-step title="Await" description="Waiting for generating invoice" />
        <el-step title="Generated" description="Wairting for adding cost" />
        <el-step title="Closed" description="Finished" />
      </el-steps>
      <h3>{{ 'Current invoice status: ' + shipOrder.invoiceStatus }}</h3>
    </div>
    <div style="margin-bottom:10px">
      <div>
        <el-button class="gb-button" type="primary" :disabled="shipOrder.invoiceStatus!='Await'" @click="closeVisible=true">Generate Invoice</el-button>
        <!-- <el-button class="gb-button" type="primary" :disabled="shipOrder.invoiceStatus!='Generated'" @click="closeVisible=true">Close Order</el-button> -->
        <el-popover
          v-model="popVisible4"
          placement="top"
          width="295"
          style="margin-left:10px"
        >
          <p>This order will be uneditable.</p>
          <p>Are you sure you want to continue?</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="popVisible3 = false">No</el-button>
            <el-button type="primary" size="mini" @click="onCloseClicked">Yes</el-button>
          </div>
          <el-button slot="reference" class="gb-button" :loading="loading" type="primary" :disabled="shipOrder.invoiceStatus!='Generated'">Close Order</el-button>
        </el-popover>
        <el-popover
          v-model="popVisible2"
          placement="top"
          width="295"
          style="margin-left:10px;margin-right:10px"
        >
          <p>The invoice status will be reset.</p>
          <p>Are you sure you want to continue?</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="popVisible2 = false">No</el-button>
            <el-button type="primary" size="mini" @click="onOpenClicked">Yes</el-button>
          </div>
          <el-button slot="reference" class="gb-button" type="warning" :disabled="shipOrder.invoiceStatus=='Await'">Reset Invoice Status</el-button>
        </el-popover>
      </div>
      <div style="margin-top:10px">
        <el-button :disabled="step>2" class="gb-button" :loading="loading" type="primary" @click="onPushClicked">Approve And Push</el-button>
        <el-button :disabled="step!=6" class="gb-button" :loading="loading" type="primary" @click="shippedVisible=true">Set Shipped Date</el-button>
      </div>
    </div>

    <el-dialog
      title="Generate Invoice"
      :visible.sync="closeVisible"
      top="5vh"
      width="350px"
      :lock-scroll="false"
    >
      <div style="text-align:right">
        <label>End Date: </label><el-date-picker v-model="closeDate" type="date" placeholder="Select close Date" value-format="yyyy-MM-dd" style="width:180px;" />
      </div>
      <div style="text-align:right;margin-right:20px">
        <label>Apply min-charge?</label>
        <el-switch
          v-model="isAppliedMinCharge"
          style="display: block"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="YES"
          inactive-text="NO"
        />
      </div>
      <div style="margin-top:20px;margin-right:10px;text-align:right">
        <el-popover
          v-model="popVisible1"
          placement="top"
          width="330"
        >
          <p>All charging details be unaddable after this operation unless reset the invoice status.</p>
          <p>Are you sure you want to continue?</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="popVisible1 = false">No</el-button>
            <el-button type="primary" size="mini" @click="onGenerateClicked">Yes</el-button>
          </div>
          <el-button slot="reference" class="gb-button" :loading="loading" type="primary">Generate</el-button>
        </el-popover>
      </div>

    </el-dialog>

    <el-dialog
      title="Select Shipped Date"
      :visible.sync="shippedVisible"
      top="5vh"
      width="350px"
      :lock-scroll="false"
    >
      <div style="text-align:right">
        <label>Shipped Date:</label>
        <el-date-picker v-model="shippedDate" type="date" placeholder="Select a date" value-format="yyyy-MM-dd" style="width:180px;" />
      </div>
      <div style="text-align:right;margin-right:10px">
        <el-popover
          v-model="popVisible3"
          placement="top"
          width="420"
        >
          <p>This operation is unreversible.</p>
          <p>You will take 100% responsibility for this operation.</p>
          <p>Are you sure you want to continue?</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="popVisible3 = false">No, I am going to double check this order</el-button>
            <el-button type="primary" size="mini" @click="onShippedClicked">Yes, I understand and will take all responsibilities</el-button>
          </div>
          <el-button slot="reference" class="gb-button" :loading="loading" type="primary">Confirm Shipping</el-button>
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
import { generateOrderInvoice, updateOrderInvoiceStatus, markOrderShipped } from '@/api/accounting'

export default {
  props: {
    shipOrder: {},
    step: 0
  },
  data() {
    return {
      closeVisible: false,
      popVisible1: false,
      popVisible2: false,
      popVisible3: false,
      popVisible4: false,
      shippedVisible: false,
      isAppliedMinCharge: false,
      closeDate: '',
      loading: false,
      shippedDate: ''
    }
  },
  computed: {
    today() {
      var date = new Date()
      return date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString() + '-' + date.getDate().toString()
    },
    invoiceStep() {
      const s = this.shipOrder.invoiceStatus
      if (s === 'Await') { return 1 } else if (s === 'Generated') { return 2 } else { return 3 }
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
    onCloseClicked() {
      this.loading = true
      this.popVisible4 = false
      updateOrderInvoiceStatus(this.shipOrder.shipOrderNumber, 'ShipOrder', 'Closed').then(() => {
        this.loading = false
        this.$emit('reloadOrder')
      })
    },
    onGenerateClicked() {
      this.loading = true
      if (this.closeDate) {
        this.popVisible1 = false
        this.loading = false
        generateOrderInvoice(this.shipOrder.shipOrderNumber, 'ShipOrder', this.closeDate, this.isAppliedMinCharge).then(() => {
          this.$emit('reloadOrder')
          this.closeVisible = false
        })
      } else {
        this.loading = false
        this.$message({
          message: 'Please select a close date',
          type: 'error'
        })
      }
    },
    onOpenClicked() {
      this.popVisible2 = false
      this.loading = true
      updateOrderInvoiceStatus(this.shipOrder.shipOrderNumber, 'ShipOrder', 'Await').then(() => {
        this.loading = false
        this.$emit('reloadOrder')
      })
    },
    onPushClicked() {
      this.loading = true
      pushShipOrderStatus(this.$route.params.shipOrderId, this.today).then(() => {
        this.loading = false
        this.$emit('reloadOrder')
      })
    },
    onShippedClicked() {
      this.popVisible3 = false
      this.loading = true
      if (this.shippedDate) {
        markOrderShipped(this.shipOrder.id, this.shippedDate).then(() => {
          this.$emit('reloadOrder')
          this.shippedVisible = false
          this.loading = false
        })
      } else {
        this.loading = false
        this.$message({
          message: 'Please select a shipped date',
          type: 'error'
        })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
