<template>
  <div class="gb-maincontainer" style="text-align:right">
    <div>
      <el-form ref="form-required" :rules="rules" :model="queryData">
        <el-row type="flex" class="row-bg" :gutter="10">
          <el-col :span="5">
            <el-form-item label="CustomerCode" prop="customerCode">
              <el-select
                v-model="queryData.customerCode"
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
        <el-row type="flex" class="row-bg" :gutter="5">
          <el-col :span="5">
            <el-form-item label="Start Date" prop="startDate">
              <el-date-picker v-model="queryData.startDate" type="date" placeholder="Select Date" style="width:170px;" value-format="yyyy-MM-dd" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="End Date" prop="closeDate">
              <el-date-picker v-model="queryData.closeDate" type="date" placeholder="Select Date" style="width:170px;" value-format="yyyy-MM-dd" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" :gutter="5">
          <el-col :span="5" />
          <el-col :span="5">
            <el-form-item label="Include open orders" style="text-align:right">
              <el-switch
                v-model="queryData.ifShowUnclosed"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="Yes"
                inactive-text="No"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" :gutter="5">
          <el-col :span="10">
            <el-button type="primary" style="margin-left:20px" @click="onDownloadInvoiceClicked">Export</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { downloadFile } from '@/api/receiving'
import { generateInvoiceByCustomerCode } from '@/api/accounting'

export default {
    props: {
        customerCodeOptions: Array
    },
    data() {
        return {
            queryData: {
                customerCode: '',
                startDate: '',
                closeDate: '',
                ifShowUnclosed: false
            },
            rules: {
                customerCode: [
                    { required: true, message: 'Customer cdoe required', trigger: 'change' }
                ],
                startDate: [
                    { required: true, message: 'Please select end date', trigger: 'change' }
                ],
                closeDate: [
                    { required: true, message: 'Please select end date', trigger: 'change' }
                ]
            },
            loading: false
        };
    },
    computed: {
    },
    watch:{
    },
    methods:{
        onDownloadInvoiceClicked() {
            this.$refs['form-required'].validate((valid) => {
                if (valid) {
                    const fullscreenLoading = this.$loading({
                        lock: false,
                        text: 'Downloading',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    });
                    generateInvoiceByCustomerCode(this.queryData.customerCode, this.queryData.startDate, this.queryData.closeDate, this.queryData.ifShowUnclosed).then(body => {
                        fullscreenLoading.close()
                        downloadFile(body.data, "Operation Expense Report");
                    }).catch(e => {
                        fullscreenLoading.close()
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    },
    mounted() {

    }
}
</script>

<style lang="scss" scoped>
    .input-bar{
      text-align: right
    }
</style>