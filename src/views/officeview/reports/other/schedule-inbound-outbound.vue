<template>
  <div class="gb-maincontainer" style="text-align:right">
    <div>
      <el-form ref="form-required" :rules="rules" :model="formData">
        <el-row type="flex" class="row-bg" :gutter="10">
          <el-col :span="5">
            <el-form-item label="Customer Code" prop="customerCode" label-width="130px">
              <el-select
                v-model="formData.customerCode"
                filterable
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
        </el-row>
        <el-row type="flex" class="row-bg" :gutter="8">
          <el-col :span="8">
            <el-form-item label="Date Range" prop="dateData"  label-width="130px">
              <el-date-picker
                v-model="formData.dateData"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="to"
                start-placeholder="Start Date"
                end-placeholder="End Date"
                :picker-options="schedulePickerOptions"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" :gutter="10">
          <el-col :span="2">
            <el-checkbox v-model="isAdvaceOrderOnly" border>Advance order only</el-checkbox>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" style="margin-left:20px" @click="onDownloadInvoiceClicked">Export & Download</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import { schedulePickerOptions } from '@/scripts/datepicker'
import { downloadFile } from '@/api/receiving'
// import { generateInvoiceByCustomerCode } from '@/api/accounting'
import { getInboundAndOutboundSchedule } from '@/api/dashboard'

export default {
  props: {
    customerCodeOptions: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      schedulePickerOptions: schedulePickerOptions,
      isAdvaceOrderOnly: false,
      formData: {
        customerCode: '',
        dateData: []
      },
      // queryData: {
      //     startDate: '',
      //     endDate: ''
      // },
      rules: {
        customerCode: [
          { required: true, message: 'Customer cdoe required', trigger: 'change' }
        ],
        dateData: [
          { required: true, message: 'This filed is required', trigger: 'change' }
        ]
      },
      loading: false
    }
  },
  computed: {
    queryData() {
      var v1 = this.formData.dateData[0]
      var v2 = this.formData.dateData[1]
      var v3 = this.isAdvaceOrderOnly
      return { startDate: v1, endDate: v2, isAdvaceOrderOnly: v3, customerCode: this.formData.customerCode }
    }
  },
  watch: {
  },
  mounted() {

  },
  methods: {
    transferDate: function(date) {
      return date.substring(0, 10)
    },
    onDownloadInvoiceClicked() {
      this.$refs['form-required'].validate((valid) => {
        if (valid) {
          const fullscreenLoading = this.$loading({
            lock: false,
            text: 'Downloading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          getInboundAndOutboundSchedule(this.queryData.startDate, this.queryData.endDate, this.queryData.isAdvaceOrderOnly, this.queryData.customerCode).then(body => {
            fullscreenLoading.close()
            downloadFile(body.data, 'Schedule')
          }).catch(e => {
            fullscreenLoading.close()
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

<style lang="scss" scoped>
    .input-bar{
      text-align: right
    }
</style>
