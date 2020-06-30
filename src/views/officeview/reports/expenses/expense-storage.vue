<template>
  <div class="gb-maincontainer" style="text-align:right">
    <div>
      <el-form ref="form-required" :rules="rules" :model="queryData">
        <el-row type="flex" class="row-bg" :gutter="12">
          <el-col :span="6">
            <el-form-item label="CustomerCode" prop="customerCode">
              <el-select
                v-model="queryData.customerCode"
                filterable
                placeholder="Input key word"
                @change="onCustomerCodeSelected"
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
        <el-row type="flex" class="row-bg" :gutter="12">
          <el-col :span="6">
            <el-form-item label="Start Date" prop="startDate">
              <el-date-picker v-model="queryData.startDate" type="date" placeholder="Select Date" style="width:170px;" value-format="yyyy-MM-dd" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="End Date" prop="closeDate">
              <el-date-picker v-model="queryData.closeDate" type="date" placeholder="Select Date" style="width:170px;" value-format="yyyy-MM-dd" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" :gutter="12">
          <el-col :span="6">
            <el-form-item label="P1 Discount" prop="p1Discount">
              <el-input v-model="queryData.p1Discount" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="P2 Discount" prop="p2Discount">
              <el-input v-model="queryData.p2Discount" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div>
      <el-table
        ref="label-files-table"
        :data="storagePriceTable"
        stripe
        border
        style="width:850px"
      >
        <el-table-column
          prop="id"
          label="Id"
          align="center"
          sortable
          width="60"
        />
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table
              ref="pick-table-plts-ctns"
              :data="props.row.chargeMethods"
              border
              stripe
            >
              <el-table-column
                prop="id"
                label="Id"
                align="center"
                width="60"
              />
              <el-table-column
                label="Customer Code"
                width="100"
                align="center"
              >
                <template>
                  <font>{{ queryData.customerCode }}</font>
                </template>
              </el-table-column>
              <el-table-column
                prop="from"
                label="From"
                width="140"
                align="center"
              >
                <template slot-scope="scope">
                  <font>{{ transTimeUnit(scope.row.from, props.row.timeUnit) }}</font>
                </template>
              </el-table-column>
              <el-table-column
                prop="to"
                label="To"
                width="140"
                align="center"
              >
                <template slot-scope="scope">
                  <font>{{ transTimeUnit(scope.row.to, props.row.timeUnit) }}</font>
                </template>
              </el-table-column>
              <el-table-column
                label="Duration"
                width="140"
                align="center"
              >
                <template slot-scope="scope">
                  <font>{{ (scope.row.to - scope.row.from + 1) + ' ' + props.row.timeUnit + ((scope.row.to - scope.row.from + 1) == 1 ? '' : 's') }}</font>
                </template>
              </el-table-column>
              <el-table-column
                label="Rate/TUOM"
                align="center"
              >
                <template slot-scope="scope">
                  <font>{{ scope.row.fee.toFixed(2) + ' ' + props.row.currency + '/' + props.row.timeUnit }}</font>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
          prop="templateName"
          label="Template Name"
          width="140"
          align="center"
        />
        <el-table-column
          prop="customer"
          label="Customer Code"
          width="140"
          align="center"
        />
        <el-table-column
          prop="timeUnit"
          label="Time Unit"
          width="110"
          align="center"
        />
        <el-table-column
          prop="currency"
          label="Currency"
          width="110"
          align="center"
        />
        <el-table-column
          prop="operation"
          align="center"
          label="operation"
        >
          <template slot-scope="scope">
            <el-button type="primary" :disabled="scope.row.chargeMethods.length == 0" @click="onUseAndDownloadClicked(scope.row.id)">Use & Download</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { downloadFile } from '@/api/receiving'
import { generateStorageInvoiceByStorageTemplate } from '@/api/accounting'
import { getCustomerStoragePriceTableByCustomerCode } from '@/api/customer'

export default {
    props: {
        customerCodeOptions: Array
    },
    data() {
        const validateDiscount = (rule, value, callback) => {
            if (!value) {
                callback(new Error('This filed is required'))
            }
            value = Number(value)
            if (typeof value === 'number' && !isNaN(value)) {
                if (value <= 0 || value > 1) {
                callback(new Error('Discount range must be between 0 and 1'))
                } else {
                callback()
                }
            } else {
                callback(new Error('Please enter valid number'))
            }
        }
        return {
            storagePriceTable: [],
            queryData: {
                customerCode: '',
                startDate: '',
                closeDate: '',
                p1Discount: 1,
                p2Discount: 1
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
                ],
                p1Discount: [
                    { required: true, message: 'This filed is required', trigger: 'change' },
                    { validator: validateDiscount, trigger: 'change' }
                ],
                p2Discount: [
                    { required: true, message: 'This filed is required', trigger: 'change' },
                    { validator: validateDiscount, trigger: 'change' }
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
        onCustomerCodeSelected() {
            getCustomerStoragePriceTableByCustomerCode(this.queryData.customerCode).then(body => {
                this.storagePriceTable = body.data
            })
        },
        transTimeUnit(num, timeUnit) {
            var unit = ''
            switch(num) {
                case 1:
                    unit = 'st'
                    break;
                case 2:
                    unit = 'nd'
                    break;
                case 3:
                    unit = 'rd'
                    break;
                default:
                    unit = 'th'
            } 
            return num + unit + ' ' + timeUnit
        },
        onUseAndDownloadClicked(id) {
            this.$refs['form-required'].validate((valid) => {
                if (valid) {
                    const fullscreenLoading = this.$loading({
                        lock: false,
                        text: 'Downloading',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    });
                    generateStorageInvoiceByStorageTemplate(id, this.queryData.customerCode, this.queryData.startDate, this.queryData.closeDate, this.queryData.p1Discount, this.queryData.p2Discount).then(body => {
                        fullscreenLoading.close()
                        downloadFile(body.data, "Storage Expense Report");
                    }).catch(e => {
                        fullscreenLoading.close()
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
        // onDownloadInvoiceClicked() {
        //     this.$refs['form-required'].validate((valid) => {

        //         const fullscreenLoading = this.$loading({
        //             lock: false,
        //             text: 'Processing',
        //             spinner: 'el-icon-loading',
        //             background: 'rgba(0, 0, 0, 0.7)'
        //         });

        //         if (valid) {
        //           generateInvoiceByCustomerCode(this.queryData.customerCode, this.queryData.startDate, this.queryData.closeDate, this.queryData.ifShowUnclosed).then(body => {
        //             fullscreenLoading.close()
        //             downloadFile(body.data, "Expense Report");
        //           }).catch(e => {
        //             fullscreenLoading.close()
        //           })
        //         } else {
        //             fullscreenLoading.close()
        //             console.log('error submit!!');
        //             return false;
        //         }
        //     });
        // }
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