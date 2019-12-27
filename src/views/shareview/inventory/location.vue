<template>
  <div class="gb-maincontainer">
    <h1>Inventory Location View</h1>
    <el-form ref="form-required" :rules="rules" :model="queryData" label-width="150px">
      <el-row type="flex" class="row-bg">
        <el-col :span="5">
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
        <el-col :span="5">
          <el-form-item label="End Date" prop="closeDate">
            <el-date-picker v-model="queryData.closeDate" type="date" placeholder="Select Date" style="width:170px;" value-format="yyyy-MM-dd" />
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
    <location-ctns :is-ctn-view="isCtnView" :fba-ctn-inventories="inventoryResults.fbaCtnInventories" @onCtnHistoryClicked="onCtnHistoryClicked" />
    <location-plts :is-ctn-view="isCtnView" :fba-plt-inventories="inventoryResults.fbaPalletGroupInventories" @onCtnHistoryClicked="onCtnHistoryClicked" />
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
/* eslint-disable */
import { getReceivingOrdersByCustomerCode, createNewrReceivingOrder, getReceivingOrderInfo, updateReceivingOrderInfo, downloadFile } from '@/api/receiving'
import { getShippingOrders, getCustomerCodes, getAddressCode, getShipOrderInfo, createNewShipOrder, updateShipOrderInfo } from '@/api/shipping'
import { getInventoryByDate, getCtnHistories, downloadInventoryReport } from '@/api/inventory'
import store from '@/store'

const customerCode = store.getters.customerCode;

export default {
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
              closeDate: '',
              fbaCtnInventories: [],
              fbaPalletGroupInventories: []
            },
            queryData: {
                customerCode: customerCode,
                closeDate: ''
            },
            rules: {
                customerCode: [
                    { required: true, message: 'Customer cdoe required', trigger: 'change' }
                ],
                closeDate: [
                    { required: true, message: 'Please select end date', trigger: 'change' }
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
        };
    },
    computed: {
      isDisabled: function() {
        return customerCode === '' ? false : true
      }
    },
    components:{
        "inventory-summary": () => import('@/views/shareview/inventory/summary'),
        "location-ctns": () => import('@/views/shareview/inventory/location-ctns'),
        "location-plts": () => import('@/views/shareview/inventory/location-plts'),
        "ctn-history": () => import('@/views/shareview/generic/generic-ctn-history')
    },
    watch:{
    },
    methods:{
        onQueryClicked() {
            this.$refs['form-required'].validate((valid) => {
                if (valid) {
                  this.loading = true;
                    getInventoryByDate(this.queryData.customerCode, this.queryData.closeDate).then(body => {
                        this.inventoryResults = body.data[0];
                        this.loading = false;
                    }).catch(e => {
                      this.loading = false;
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        onDownloadClicked() {
            this.$refs['form-required'].validate((valid) => {
                if (valid) {
                  this.loading = true;
                  downloadInventoryReport(this.queryData.customerCode, this.queryData.closeDate).then(body => {
                    this.loading = false;
                    // alert(body.data)
                    downloadFile(body.data, "Inventory");
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
          getCtnHistories(id).then(body => {
            this.ctnHistoryVisible = true;
            this.ctnOutboundHistories = body.data;
            this.historySum.container = body.data[0].container;
            this.historySum.customerCode = body.data[0].customerCode;
            this.historySum.shipmentId = body.data[0].shipmentId;
            this.historySum.amzRefId = body.data[0].amzRefId;
            this.historySum.warehouseCode = body.data[0].warehouseCode;

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