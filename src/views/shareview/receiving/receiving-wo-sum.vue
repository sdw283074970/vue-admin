<template>
  <div>
    <h1>Receiving Order Detail Page</h1>
    <el-button @click="btnBackClicked">Back</el-button>
    <el-button class="gb-button" :disabled="step<3" :loading="loading" @click="downloadWOHandler">Download WO</el-button>
    <el-button class="gb-button" :disabled="step<8" :loading="loading" @click="onDownloadReceiptClicked">Download Receipt</el-button>
    <div style="margin-top:20px">
      <el-steps :active="step" finish-status="success" align-center>
        <el-step title="Step1: Start" description="Waiting for uploading" />
        <el-step title="Step2: Uploading" description="Waiting for drafting" />
        <el-step title="Step3: Draft" description="Waiting for pushing" />
        <el-step title="Step4: Incoming" description="Waiting for arriving" />
        <el-step title="Step5: Arrived" description="Waiting to start" />
        <el-step title="Step6: Processing" description="Waiting to finish processing" />
        <el-step title="Step7: Received" description="Waiting to finish palletizing" />
        <el-step title="Step8: Registered" description="Waiting to finish allocating" />
        <el-step title="Step9: Allocated" description="Waiting for shipping" />
        <!-- <el-step title="Step8: Cleared Out"></el-step> -->
      </el-steps>
    </div>
    <div>
      <h2>Summary</h2>
      <el-form label-position="left" inline class="gb-table-expand">
        <el-form-item label="Container #">
          <span>{{ masterOrder.container }}</span>
        </el-form-item>
        <el-form-item label="Grand #">
          <span>{{ masterOrder.grandNumber }}</span>
        </el-form-item>
        <el-form-item label="Customer Code">
          <span>{{ masterOrder.customerCode }}</span>
        </el-form-item>
        <el-form-item label="Sub-customer">
          <span>{{ masterOrder.subCustomer }}</span>
        </el-form-item>
        <el-form-item label="Inbound Type">
          <span>{{ masterOrder.inboundType }}</span>
        </el-form-item>
        <el-form-item label="Unloading Type">
          <span>{{ masterOrder.unloadingType }}</span>
        </el-form-item>
        <el-form-item label="Storage Type">
          <span>{{ masterOrder.storageType }}</span>
        </el-form-item>
        <el-form-item label="Palletizing">
          <span>{{ masterOrder.palletizing }}</span>
        </el-form-item>
        <el-form-item label="Carrier">
          <span>{{ masterOrder.carrier }}</span>
        </el-form-item>
        <el-form-item label="Container Size">
          <span>{{ masterOrder.containerSize }}</span>
        </el-form-item>
        <el-form-item label="Original Plts">
          <span>{{ masterOrder.originalPlts }}</span>
        </el-form-item>
        <el-form-item label="Dock #">
          <span>{{ masterOrder.dockNumber }}</span>
        </el-form-item>
        <el-form-item label="Lumper">
          <span>{{ masterOrder.lumper }}</span>
        </el-form-item>
        <el-form-item label="Is Damaged">
          <span>{{ masterOrder.isDamaged }}</span>
        </el-form-item>
        <el-form-item label="Verified By">
          <span>{{ masterOrder.verifiedBy }}</span>
        </el-form-item>
        <el-form-item label="Quick Instruction">
          <span>{{ masterOrder.instruction }}</span>
        </el-form-item>
        <el-form-item label="ETA">
          <span>{{ masterOrder.eta }}</span>
        </el-form-item>
        <el-form-item label="Place Date">
          <span>{{ transferDate(masterOrder.pushTime) }}</span>
        </el-form-item>
        <el-form-item label="Inbound Date">
          <span>{{ transferDate(masterOrder.inboundDate) }}</span>
        </el-form-item>
        <el-form-item label="Start Date">
          <span>{{ transferDate(masterOrder.unloadStartTime) }}</span>
        </el-form-item>
        <el-form-item label="Finish Date">
          <span>{{ transferDate(masterOrder.unloadFinishTime) }}</span>
        </el-form-item>
        <el-form-item label="Out Date">
          <span>{{ transferDate(masterOrder.outTime) }}</span>
        </el-form-item>
        <el-form-item label="Latest Close Date">
          <span>{{ transferDate(masterOrder.closeDate) }}</span>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
/* eslint-disable handle-callback-err */
/* eslint-disable vue/require-prop-types */
import { generateReceivingReceipt, generateWO, downloadFile } from '@/api/receiving'

export default {
  props: {
    masterOrder: {},
    step: Number,
    orderDetails: Array
  },
  data() {
    return {
      loading: false
    }
  },
  mounted() {

  },
  methods: {
    transferDate: function(date) {
      return date === undefined ? '' : (date.substring(0, 4) === '1900' ? '-' : date.substring(0, 10))
    },
    btnBackClicked: function() {
      this.$router.go(-1)
    },
    onCommingSoonClicked() {
      this.$message({
        message: 'Feature comming soon',
        type: 'warning'
      })
    },
    onDownloadReceiptClicked() {
      this.loading = true
      generateReceivingReceipt(this.masterOrder.id).then(body => {
        this.$message({
          message: 'Downloading...',
          type: 'success'
        })
        this.loading = false
        downloadFile(body.data, 'Receipt')
      }).catch(error => {
        this.loading = false
      })
    },
    downloadWOHandler() {
      this.loading = true
      generateWO(this.masterOrder.id).then(body => {
        this.$message({
          message: 'Downloading...',
          type: 'success'
        })
        downloadFile(body.data, 'Work Order')
        this.loading = false
      }).catch(error => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
