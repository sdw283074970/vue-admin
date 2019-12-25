<template>
  <div class="gb-maincontainer">
    <h1>Shipping Manager</h1>
    <shipping-index-table
      :filtered-data="filteredData"
      :total-entries="totalEntries"
      :loading="loading"
      @onEditClicked="onEidtClicked"
      @onCreateClicked="onCreateClicked"
      @onSearchChanged="onSearchChanged"
    />
    <div>
      <el-dialog
        title="Create/Edit"
        :visible.sync="editVisible"
        width="750px"
        top="5vh"
        :lock-scroll="false"
      >
        <shipping-index-edit-form
          :form-data="formData"
          :is-edit="isEdit"
          :ship-order-status="shipOrderStatus"
          :destination-options="destinationOptions"
          :customer-code-options="customerCodeOptions"
          @onCreateConfirmedClicked="onCreateConfirmedClicked"
          @onEditConfirmedClicked="onEditConfirmedClicked"
          @onCancelClicked="onCancelClicked"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { getShippingOrders, getCustomerCodes, getAddressCode, getShipOrderInfo, createNewShipOrder, updateShipOrderInfo } from '@/api/shipping'
import Axios from 'axios';
import qs from 'qs';

export default {
    components:{
        "shipping-index-edit-form": () => import('@/views/officeview/shipping/index-edit-form'),
        "shipping-index-table": () => import('@/views/officeview/shipping/index-table')
    },
    data() {
        return {
            loading: true,
            tableData : [],
            totalEntries: 0,
            customerCodeOptions: [],
            destinationOptions: [],
            isEdit: false,
            editVisible: false,
            filteredData: [],
            dialogFormVisible : false,
            shipOrderStatus: '',
            formData: {
              id : 0,
              status: '',
              shipOrderNumber: '',
              customerCode: '',
              ets: '',
              orderType: 'Standard',
              invoiceStatus: 'Await',
              destination: '',
              pickReference: '',
              carrier: '',
              batchNumber: '',
              podStatus: false,
              etsTimeRange: '',
              bolNumber: '',
              pickNumber: '',
              subCustomer: '',
              purchaseOrderNumber: '',
              instruction: ''
            }
        };
    },
    methods:{
      onSearchChanged(search){
        this.filteredData = this.tableData.filter(data => {
            return Object.keys(data).some(key => {
              return String(data[key]).toLowerCase().indexOf(search.toLowerCase()) > -1
          })
        })
        this.totalEntries = this.filteredData.length;
      },
      onCreateConfirmedClicked(){
        createNewShipOrder(this.formData).then(body => {
          this.$message({
            message: 'Success!',
            type: 'success'
          });
          this.editVisible = false;
          this.filteredData.splice(0, 0, body.data);
        })
      },
      onEditConfirmedClicked(id){
        updateShipOrderInfo(id, this.formData).then(body => {
          this.$message({
            message: 'Success!',
            type: 'success'
          });
          this.editVisible = false;
          let index = this.filteredData.map(o => o.id).indexOf(body.data.id);
          this.filteredData.splice(index, 1, body.data);
        })
      },
      onCancelClicked(){
        this.editVisible = false;
      },
      onCreateClicked(){
        this.editVisible = true;
        this.isEdit = false;
        this.formData = {
          id : 0,
          status: 'New Created',
          shipOrderNumber: '',
          customerCode: '',
          ets: '',
          orderType: 'Standard',
          invoiceStatus: 'Await',
          destination: '',
          pickReference: '',
          carrier: '',
          batchNumber: '',
          podStatus: false,
          etsTimeRange: '',
          bolNumber: '',
          pickNumber: '',
          subCustomer: '',
          purchaseOrderNumber: '',
          instruction: ''
        }
      },
      onEidtClicked(id){
        this.editVisible = true;
        this.isEdit = true;
        getShipOrderInfo(id).then(body => {
          this.formData = body.data
        })
      }
    },
    mounted() {
      getShippingOrders().then(
          body => {
              this.tableData = body.data.reverse();
              this.totalEntries = body.data.length;
              this.filteredData = body.data;
              this.loading = false;
          }
      ),
      getCustomerCodes().then(
        body => {
          this.customerCodeOptions = body.data
        }
      ),
      getAddressCode().then(
        body => {
          this.destinationOptions = body.data
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
