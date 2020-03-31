<template>
  <div class="gb-maincontainer">
    <h1>Expenses Reports</h1>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="Export Operation Expenses Report" name="1">
        <el-form ref="form-required" :rules="rules" :model="queryData" label-width="150px">
          <el-row type="flex" class="row-bg">
            <el-col :span="4">
              <el-form-item label="CustomerCode" prop="customerCode">
                <el-select
                  v-model="queryData.customerCode"
                  :disabled="isDisabled"
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
            <el-col :span="4">
              <el-form-item label="Start Date" prop="startDate">
                <el-date-picker v-model="queryData.startDate" type="date" placeholder="Select Date" style="width:170px;" value-format="yyyy-MM-dd" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="End Date" prop="closeDate">
                <el-date-picker v-model="queryData.closeDate" type="date" placeholder="Select Date" style="width:170px;" value-format="yyyy-MM-dd" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="Include open orders" label-width="240px">
                <el-switch
                  v-model="queryData.ifShowUnclosed"
                  style="margin-left:10px"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="Yes"
                  inactive-text="No"
                />
                <el-button type="primary" style="margin-left:20px" :loading="loading" @click="onDownloadInvoiceClicked">Export Report</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="Export Storage Expenses Report" name="2" />
      <el-collapse-item title="Comming Soon" name="3" />
      <el-collapse-item title="Comming Soon" name="4" />
      <el-collapse-item title="Comming Soon" name="5" />
      <el-collapse-item title="Comming Soon" name="6" />
      <el-collapse-item title="Comming Soon" name="7" />
      <el-collapse-item title="Comming Soon" name="8" />
      <el-collapse-item title="Comming Soon" name="9" />
      <el-collapse-item title="Comming Soon" name="10" />
      <el-collapse-item title="Comming Soon" name="11" />
      <el-collapse-item title="Comming Soon" name="12" />
      <el-collapse-item title="Comming Soon" name="13" />
      <el-collapse-item title="Comming Soon" name="14" />
      <el-collapse-item title="Comming Soon" name="15" />
    </el-collapse>
  </div>
</template>

<script>
/* eslint-disable */
import { getReceivingOrdersByCustomerCode, createNewrReceivingOrder, getReceivingOrderInfo, updateReceivingOrderInfo, downloadFile } from '@/api/receiving'
import { getShippingOrders, getCustomerCodes, getAddressCode, getShipOrderInfo, createNewShipOrder, updateShipOrderInfo } from '@/api/shipping'
import { generateInvoiceByCustomerCode } from '@/api/accounting'
import store from '@/store'

const customerCode = store.getters.customerCode;

export default {
    data() {
        return {
            activeNames: ['1'],
            queryData: {
                customerCode: customerCode,
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
            customerCodeOptions: [],
            loading: false
        };
    },
    computed: {
      isDisabled: function() {
        return customerCode === '' ? false : true
      }
    },
    watch:{
    },
    methods:{
        onDownloadInvoiceClicked() {
            this.$refs['form-required'].validate((valid) => {
                if (valid) {
                  this.loading = true;
                  generateInvoiceByCustomerCode(this.queryData.customerCode, this.queryData.startDate, this.queryData.closeDate, this.queryData.ifShowUnclosed).then(body => {
                    this.loading = false;
                    downloadFile(body.data, "Expense Report");
                  }).catch(e => {
                    this.loading = false;
                  })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        onCtnHistoryClicked(id) {
          var obj = this.inventoryResults.fbaCtnInventories.find(x => x.id == id);
          this.historySum.container = obj.container;
          this.historySum.customerCode = this.queryData.customerCode;
          this.historySum.shipmentId = obj.shipmentId;
          this.historySum.amzRefId = obj.amzRefId;
          this.historySum.warehouseCode = obj.warehouseCode;
          getCtnHistories(id).then(body => {
            this.ctnHistoryVisible = true;
            this.ctnOutboundHistories = body.data;
          })
        },
        onPltHistoryClicked(pltId) {
          var obj = this.inventoryResults.fbaPalletGroupInventories.find(x => x.pltId == pltId);
          this.historySum.container = obj.container;
          this.historySum.customerCode = this.queryData.customerCode;
          this.historySum.shipmentId = 'MULTIPLE';
          this.historySum.amzRefId = 'MULTIPLE';
          this.historySum.warehouseCode = 'MULTIPLE';
          getPltHistories(pltId).then(body => {
            this.ctnHistoryVisible = true;
            this.ctnOutboundHistories = body.data;
          })
        }
    },
    mounted() {
      getCustomerCodes().then(
        body => {
          this.customerCodeOptions = body.data
        }
      )
    }
}
</script>

<style lang="scss" scoped>
    .input-bar{
      text-align: right
    }
</style>