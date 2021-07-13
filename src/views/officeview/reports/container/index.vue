<template>
  <div class="gb-maincontainer">
    <h1>Container Fee Report</h1>
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
              start-placeholder="Start Date"
              end-placeholder="End Date"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" :loading="loading" @click="onQueryClicked">Query</el-button>
          <el-button type="primary" :loading="loading" @click="onDownloadClicked" disabled>Download</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div>
        <el-table
        ref="container-report"
        show-summary
        :data="localTableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        stripe
        border
        :height="tableHight"
        style="width: 100%"
        >
            <el-table-column type="expand" fixed="left" width="60">
                <template slot-scope="props">
                <el-table
                    ref="pick-table-plts-ctns"
                    :data="props.row.contianerFeeDetails"
                    border
                    show-summary
                    stripe
                >
                    <el-table-column
                    prop="orderReference"
                    label="Order Reference"
                    width="160"
                    />
                    <el-table-column
                    prop="orderType"
                    label="Order Type"
                    width="90"
                    />
                    <el-table-column
                    prop="activity"
                    label="Activity"
                    align="center"
                    width="200"
                    />
                    <el-table-column
                    prop="percent"
                    label="Percent of Order"
                    align="center"
                    width="80"
                    />
                    <el-table-column
                    prop="chargingType"
                    label="Charging Type"
                    width="80"
                    align="center"
                    />
                    <el-table-column
                    prop="uom"
                    label="UOM"
                    width="90"
                    align="center"
                    />
                    <el-table-column
                    prop="quantity"
                    label="Quantity"
                    align="center"
                    width="100"
                    />
                    <el-table-column
                        prop="rate"
                        align="center"
                        label="Rate"
                        width="100"
                    >
                        <template slot-scope="scope">
                            <font>{{ '$ ' + scope.row.rate }}</font>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="originalAmount"
                        align="center"
                        label="Original Amount"
                        width="120"
                    >
                        <template slot-scope="scope">
                            <font>{{ '$ ' + scope.row.originalAmount }}</font>
                        </template>
                    </el-table-column>
                    <el-table-column
                    prop="discountRate"
                    align="center"
                    label="Discount"
                    width="100"
                    />
                    <el-table-column
                        prop="finalAmount"
                        label="Final Amount"
                        align="center"
                        width="120"
                    >
                        <template slot-scope="scope">
                            <font>{{ '$ ' + scope.row.finalAmount }}</font>
                        </template>
                    </el-table-column>
                    <el-table-column
                    prop="memo"
                    label="Memo"
                    align="center"
                    />
                </el-table>
                </template>
            </el-table-column>
            <el-table-column
                prop="container"
                label="Container"
                width="200"
            />
            <el-table-column
                prop="customerCode"
                align="center"
                label="Customer"
                width="120"
            />
            <el-table-column
                prop="subCustomer"
                align="center"
                label="Sub-customer"
                width="120"
            >
                <template slot-scope="scope">
                    <font>{{ scope.row.subCustomer === '' ? '-' : scope.row.subCustomer }}</font>
                </template>
            </el-table-column>
            <el-table-column
                prop="inboundDate"
                align="center"
                label="Inbound Date"
                width="120"
            >
                <template slot-scope="scope">
                    <font>{{ transferDate(scope.row.inboundDate) }}</font>
                </template>
            </el-table-column>
            <el-table-column
                prop="originalPlts"
                align="center"
                label="Receivable Plts"
                width="100"
            />
            <el-table-column
                prop="actualPlts"
                align="center"
                label="Actual Plts"
                width="70"
            />
            <el-table-column
                prop="originalCtns"
                align="center"
                label="Receivable Ctns"
                width="100"
            />
            <el-table-column
                prop="actualCtns"
                align="center"
                label="Actual Ctns"
                width="70"
            />
            <el-table-column
                prop="invoiceStatus"
                align="center"
                label="Invoice Status"
                width="130"
            />
            <el-table-column
                prop="closeDate"
                align="center"
                label="Close Date"
                width="120"
            >
                <template slot-scope="scope">
                    <font>{{ transferDate(scope.row.closeDate) }}</font>
                </template>
            </el-table-column>
            <el-table-column
                prop="chargingCounts"
                align="center"
                label="Charging Counts"
                width="140"
            />
            <el-table-column
                prop="totalAmount"
                align="center"
                label="Total Amount"
            >
                <template slot-scope="scope">
                    <font>{{ '$ ' + scope.row.totalAmount.toFixed(2) }}</font>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
        style="margin-top:10px"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="20"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalEntries"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        />
    </div>
  </div>
</template>

<script>
import { downloadFile } from '@/api/receiving'
import { getCustomerCodes } from '@/api/shipping'
import { downloadInventoryReport } from '@/api/inventory'
import { getContainerReportByDate } from '@/api/receiving'
import store from '@/store'

const customerCode = store.getters.customerCode

export default {
  data() {
    return {
      tableHight: window.innerHeight * 0.7,
      currentPage: 1,
      pageSize: 20,
      search: '',
      totalEntries: 0,
      localTableData: [],
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
      loading: false,
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
          getContainerReportByDate(this.queryData.customerCode, this.queryData.dateRange[0], this.queryData.dateRange[1]).then(body => {
            this.localTableData = body.data
            this.totalEntries = this.localTableData.length
            fullscreenLoading.close()
            this.loading = false
            this.$message({
              message: 'Success',
              type: 'success'
            })
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
    transferDate: function(date) {
      return date === undefined ? '' : (date.substring(0, 4) === 1900 ? '-' : date.substring(0, 10))
    },
    onSearchChanged(search) {
      this.currentPage = 1
      this.localTableData = this.fbaPltInventories.filter(data => {
        return Object.keys(data).some(key => {
          return String(data[key]).toLowerCase().indexOf(search.toLowerCase()) > -1
        })
      })
      this.totalEntries = this.localTableData.length
    },
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
    }
  }
}
</script>

<style lang="scss" scoped>
    .input-bar{
      text-align: right
    }
</style>
