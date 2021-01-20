<template>
  <div class="gb-maincontainer">
    <h1>Inventory Location View</h1>
    <el-form ref="form-required" :rules="rules" :model="queryData">
      <el-row type="flex" class="row-bg" :gutter="20">
        <el-col :span="5">
          <el-form-item label="Customer Code" prop="customerCode">
            <el-select
              v-model="queryData.customerCode"
              :disabled="isDisabled"
              filterable
              size="small"
              placeholder="Input key word"
            >
              <el-option
                v-for="item in customerCodeOptions"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="Date Range" prop="dateRange">
            <el-date-picker
              v-model="queryData.dateRange"
              type="daterange"
              size="small"
              range-separator="-"
              start-placeholder="Inbound Date"
              end-placeholder="End Date"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" :loading="loading" @click="onQueryClicked">Query</el-button>
          <el-button type="primary" :loading="loading" @click="onDownloadClicked">Download</el-button>
        </el-col>
      </el-row>
    </el-form>
    <inventory-summary :inventory-results="inventoryResults" />
    <el-switch
      v-model="isCtnView"
      style="margin-left:10px"
      active-color="#13ce66"
      inactive-color="#ff4949"
      active-text="Ctn View"
      inactive-text="Plt View"
    />
    <location-ctns ref="childCtns" :is-ctn-view="isCtnView" :fba-ctn-inventories="inventoryResults.fbaCtnInventories" @onCtnHistoryClicked="onCtnHistoryClicked" @reloadOrder="reloadOrder" />
    <location-plts ref="childPlts" :is-ctn-view="isCtnView" :fba-plt-inventories="inventoryResults.fbaPalletGroupInventories" @onPltHistoryClicked="onPltHistoryClicked" @onCtnHistoryClicked="onCtnHistoryClicked" @reloadOrder="reloadOrder" />
    <el-dialog
      title="Ctn Outbound History"
      :visible.sync="ctnHistoryVisible"
      width="900px"
      top="5vh"
      :lock-scroll="false"
    >
      <ctn-history :ctn-outbound-histories="ctnOutboundHistories" :history-sum="historySum" />
    </el-dialog>
  </div>
</template>

<script>
import { downloadFile } from '@/api/receiving'
import { getCustomerCodes } from '@/api/shipping'
import { getInventoryByDate, getCtnHistories, downloadInventoryReport, getPltHistories } from '@/api/inventory'
import store from '@/store'

const customerCode = store.getters.customerCode

export default {
  components: {
    'inventory-summary': () => import('@/views/shareview/inventory/summary'),
    'location-ctns': () => import('@/views/shareview/inventory/location-ctns'),
    'location-plts': () => import('@/views/shareview/inventory/location-plts'),
    'ctn-history': () => import('@/views/shareview/generic/generic-ctn-history')
  },
  data() {
    return {
      inventoryResults: {
        customer: customerCode,
        originalTotalPlts: 0,
        currentTotalPlts: 0,
        currentTotalCtns: 0,
        originalLooseCtns: 0,
        currentLooseCtns: 0,
        totalPickingPlts: 0,
        totalPickingCtns: 0,
        startDate: '',
        closeDate: '',
        fbaCtnInventories: [],
        fbaPalletGroupInventories: []
      },
      pickerOptions: {
        shortcuts: [{
          text: 'Last week',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: 'Last month',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: 'Last 3 months',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: 'Last year',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: 'Last 3 years',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365 * 3)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      queryData: {
        customerCode: customerCode,
        dateRange: []
      },
      rules: {
        customerCode: [
          { required: true, message: 'Customer cdoe required', trigger: 'change' }
        ],
        dateRange: [
          { required: true, message: 'Please select inbound date and end date', trigger: 'change' }
        ]
      },
      customerCodeOptions: [],
      ctnOutboundHistories: [],
      pltOutboundHistories: [],
      loading: false,
      isCtnView: true,
      historySum: {
        container: '',
        customerCode: '',
        shipmentId: '',
        amzRefId: '',
        warehouseCode: ''
      },
      ctnHistoryVisible: false,
      pltHistoryVisible: false
    }
  },
  computed: {
    isDisabled: function() {
      return customerCode !== ''
    }
  },
  watch: {
  },
  mounted() {
    getCustomerCodes().then(
      body => {
        this.customerCodeOptions = body.data
      }
    )
  },
  methods: {
    reloadOrder() {
      this.onQueryClicked()
    },
    onQueryClicked() {
      this.$refs['form-required'].validate((valid) => {
        if (valid) {
          this.loading = true
          const fullscreenLoading = this.$loading({
            lock: false,
            text: 'Processing...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          getInventoryByDate(this.queryData.customerCode, this.queryData.dateRange[0], this.queryData.dateRange[1]).then(body => {
            this.inventoryResults = body.data[0]
            fullscreenLoading.close()
            this.loading = false
            this.$message({
              message: 'Success',
              type: 'success'
            })
            this.$refs.childCtns.doSearch()
            this.$refs.childPlts.doSearch()
          }).catch(e => {
            alert(e)
            this.loading = false
            fullscreenLoading.close()
            this.$message({
              message: 'Failed',
              type: 'warning'
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onDownloadClicked() {
      this.$refs['form-required'].validate((valid) => {
        if (valid) {
          this.loading = true
          downloadInventoryReport(this.queryData.customerCode, this.queryData.dateRange[0], this.queryData.dateRange[1]).then(body => {
            this.loading = false
            // alert(body.data)
            downloadFile(body.data, 'Inventory')
          }).catch(e => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onCtnHistoryClicked(id) {
      var obj = this.inventoryResults.fbaCtnInventories.find(x => x.id === id)
      this.historySum.container = obj.container
      this.historySum.customerCode = this.queryData.customerCode
      this.historySum.shipmentId = obj.shipmentId
      this.historySum.amzRefId = obj.amzRefId
      this.historySum.warehouseCode = obj.warehouseCode
      getCtnHistories(id).then(body => {
        this.ctnHistoryVisible = true
        this.ctnOutboundHistories = body.data
      })
    },
    onPltHistoryClicked(pltId) {
      var obj = this.inventoryResults.fbaPalletGroupInventories.find(x => x.pltId === pltId)
      this.historySum.container = obj.container
      this.historySum.customerCode = this.queryData.customerCode
      this.historySum.shipmentId = 'MULTIPLE'
      this.historySum.amzRefId = 'MULTIPLE'
      this.historySum.warehouseCode = 'MULTIPLE'
      getPltHistories(pltId).then(body => {
        this.ctnHistoryVisible = true
        this.ctnOutboundHistories = body.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
    .input-bar{
      text-align: right
    }
</style>
