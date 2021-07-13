<template>
  <div id="all-receiving-wo-summary">
    <h1>Receiving Order Detail Page</h1>
    <el-button @click="btnBackClicked">Back</el-button>
    <el-button id="all-receiving-wo-summary-wo" class="gb-button" :disabled="step<3" :loading="loading" @click="downloadWOHandler">Download WO</el-button>
    <el-button id="all-receiving-wo-summary-receipt" class="gb-button" :disabled="step<8" :loading="loading" @click="onDownloadReceiptClicked">Download Receipt</el-button>
    <el-button id="all-receiving-wo-summary-receipt" class="gb-button" :disabled="step<8" :loading="loading" @click="onDownloadBOLClicked">Download BOL</el-button>
    <el-button icon="el-icon-info" @click.prevent.stop="guide">Guide</el-button>
    <div id="all-receiving-wo-summary-status" style="margin-top:20px">
      <el-steps :active="step" finish-status="success" align-center>
        <el-step title="Start" description="Waiting for uploading" />
        <el-step title="Step1: Uploading" description="Waiting for drafting" />
        <el-step title="Step2: Draft" description="Waiting for pushing" />
        <el-step title="Step3: Incoming" description="Waiting for arriving" />
        <el-step title="Step4: Arrived" description="Waiting to start" />
        <el-step title="Step5: Processing" description="Waiting to finish processing" />
        <el-step title="Step6: Received" description="Waiting to finish palletizing" />
        <el-step title="Step7: Registered" description="Waiting to finish allocating" />
        <el-step title="Step8: Allocated" description="Waiting for shipping" />
        <el-step title="Confirmed" />
        <!-- <el-step title="Step8: Cleared Out"></el-step> -->
      </el-steps>
    </div>
    <div id="all-receiving-wo-summary-board">
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
        <el-form-item label="Create Date">
          <span>{{ transferDate(masterOrder.createDate) }}</span>
        </el-form-item>
        <el-form-item label="ETA">
          <span>{{ masterOrder.eta }}</span>
        </el-form-item>
        <el-form-item label="Push Date">
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
        <el-form-item label="Latest End Date">
          <span>{{ transferDate(masterOrder.closeDate) }}</span>
        </el-form-item>
        <el-form-item label="Warehouse Loc">
          <span>{{ masterOrder.warehouseLocation }}</span>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
      title="Select SKUs from Packing List"
      :visible.sync="bolVisible"
      top="5vh"
      width="1400px"
      :lock-scroll="false"
    >
      <el-table
        id="csr-receiving-orders"
        ref="table"
        v-loading="loading"
        :data="orderDetails"
        stripe
        border
        :max-height="500"
        style="width: 100%"
      >
        <el-table-column
          sortable
          prop="id"
          label="Id"
          width="60"
        />
        <el-table-column
          prop="shipmentId"
          sortable=""
          label="Shipment Id/SKU"
          width="200"
        />
        <el-table-column
          prop="amzRefId"
          sortable=""
          label="Amz Ref Id"
          width="200"
        />
        <el-table-column
          prop="warehouseCode"
          label="Whse Code"
          align="center"
          width="100"
        />
        <el-table-column
          prop="howToDeliver"
          align="center"
          label="Delivery"
          width="100"
        />
        <el-table-column
          prop="grossWeight"
          label="G.W."
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <font>{{ scope.row.actualGrossWeight.toFixed(2) }} of {{ scope.row.grossWeight.toFixed(2) }}</font>
          </template>
        </el-table-column>
        <el-table-column
          prop="cbm"
          label="CBM"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <font>{{ scope.row.actualCBM.toFixed(2) }} of {{ scope.row.cbm.toFixed(2) }}</font>
          </template>
        </el-table-column>
        <el-table-column
          prop="lotSize"
          label="Is Oversize"
          align="center"
          width="90"
        />
        <el-table-column
          prop="quantity"
          label="Quantity"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <font>{{ scope.row.actualQuantity }} of {{ scope.row.quantity }}</font>
          </template>
        </el-table-column>
        <el-table-column
          prop="operation"
          align="center"
          label="operation"
        >
          <template slot-scope="scope">
            <el-input v-model="scope.row.selectedQuantity" style="width:80px" />
            <el-button @click="onAllClicked(scope.row.id)">All</el-button>
            <el-button @click="onClearClicked(scope.row.id)">Clear</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top:10px;text-align:right">
        <el-button :loading="loading" @click="onSelectAllClicked">Select All</el-button>
        <el-button :loading="loading" @click="onClearAllClicked">Clear All</el-button>
      </div>
      <div style="margin-top:10px;text-align:right">
        <el-form ref="form-required" :rules="rules" :model="formData" label-width="1130px" label-position="right">
          <el-form-item label="Freight Charge" prop="freightCharge">
            <el-select v-model="formData.freightCharge" placeholder="-- Please Select --">
              <el-option
                v-for="item in freightCharge"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="BOL Number" prop="bolNumber">
            <el-input v-model="formData.bolNumber" />
          </el-form-item>
          <el-form-item label="WHS Code" prop="warehouseCode">
            <el-input v-model="formData.warehouseCode" />
          </el-form-item>
          <el-form-item label="Address" prop="address">
            <el-input v-model="formData.address" />
          </el-form-item>
          <el-form-item label="Carrier" prop="carrier">
            <el-input v-model="formData.carrier" />
          </el-form-item>
          <el-form-item label="Plt Quantity" prop="pltQuantity">
            <el-input v-model="formData.pltQuantity" />
          </el-form-item>
        </el-form>
        </div>
      <div style="margin-top:10px;text-align:right">
        <el-input v-model="formData.operator" disabled />
        <el-button :loading="loading" type="primary" @click="onGenerateClicked">Generate BOL</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
/* eslint-disable handle-callback-err */
/* eslint-disable vue/require-prop-types */
import { frieghtCharge } from '@/scripts/dropdown'
import { all_receiving_summary_steps } from '@/guide/steps'
import store from '@/store'
import { generateReceivingReceipt, generateWO, downloadFile, generateBOL } from '@/api/receiving'

export default {
  props: {
    masterOrder: {},
    step: Number,
    orderDetails: Array
  },
  data() {
    return {
      driver: null,
      loading: false,
      bolVisible: false,
      freightCharge: frieghtCharge,
      formData: {
        freightCharge: '',
        operator: store.getters.name,
        bolNumber: '',
        address: '',
        warehouseCode: '',
        carrier: '',
        pltQuantity: 0
      },
      rules: {
        freightCharge: [
          { required: true, message: 'Please select freight charge', trigger: 'change' }
        ],
        bolNumber: [
          { required: true, message: 'Please input BOL number', trigger: 'change' }
        ],
        warehouseCode: [
          { required: true, message: 'Please input warehouse', trigger: 'change' }
        ],
        address: [
          { required: true, message: 'Please input address', trigger: 'change' }
        ],
        carrier: [
          { required: true, message: 'Please input carrier', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.driver = new this.$driver()
  },
  methods: {
    onAllClicked(id) {
      this.orderDetails.find(function(i) {
        if (i.id === id) {
          i.selectedQuantity = i.actualQuantity
        }
      })
    },
    onClearClicked(id) {
      this.orderDetails.find(function(i) {
        if (i.id === id) {
          i.selectedQuantity = 0
        }
      })
    },
    guide() {
      this.driver.defineSteps(all_receiving_summary_steps)
      this.driver.start()
    },
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
    onSelectAllClicked() {
      this.orderDetails.forEach(i => {
        i.selectedQuantity = i.actualQuantity
      })
    },
    onClearAllClicked() {
      this.orderDetails.forEach(i => {
        i.selectedQuantity = 0
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
    onDownloadBOLClicked() {
      this.bolVisible = true

    },
    onGenerateClicked() {

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
    },
    onGenerateClicked() {
      this.$refs['form-required'].validate((valid) => {
        if (valid) {
          this.loading = true
          var bolInfo = { orderDetails: this.orderDetails, bolDetail: this.formData }
          generateBOL(this.masterOrder.id, this.formData.freightCharge, this.formData.operator, bolInfo).then(body => {
            this.$message({
              message: 'Downloading...',
              type: 'success'
            })
            downloadFile(body.data, 'BOL')
            this.loading = false
            this.bolVisible = false
          }).catch(error => {
            this.loading = false
            this.bolVisible = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
