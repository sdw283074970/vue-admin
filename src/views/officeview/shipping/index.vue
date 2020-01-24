<template>
  <div class="gb-maincontainer">
    <h1>Shipping Manager</h1>
    <shipping-index-table
      :table-data="tableData"
      :loading="loading"
      :customer-code-filters="customerCodeFilters"
      :destination-options="destinationOptions"
      :customer-code-options="customerCodeOptions"
      @onEfilesClicked="onEfilesClicked"
      @onEditClicked="onEidtClicked"
      @onCreateClicked="onCreateClicked"
      @onSearchChanged="onSearchChanged"
      @onFilterConfirmed="onFilterConfirmed"
      @onRefreshClicked="onRefreshClicked"
    />
    <div>
      <el-dialog
        title="Manage Efiles"
        :visible.sync="efileVisible"
        width="800px"
        top="5vh"
        :lock-scroll="false"
      >
        <generic-efiles
          :efiles="efiles"
          :reference="reference"
          :order-type="orderType"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { getReceivingOrders, createNewrReceivingOrder, getReceivingOrderInfo, updateReceivingOrderInfo, getEfiles, getCustomerCodeFilters, getFilteredDate } from '@/api/receiving'
import { getShippingOrders, getCustomerCodes, getAddressCode, getShipOrderInfo, createNewShipOrder, updateShipOrderInfo } from '@/api/shipping'
import Axios from 'axios';
import qs from 'qs';

export default {
    components:{
        "shipping-index-table": () => import('@/views/officeview/shipping/index-table'),
        "generic-efiles": () => import('@/views/shareview/generic/generic-efiles')
    },
    data() {
        return {
            loading: true,
            tableData : [],
            totalEntries: 0,
            customerCodeOptions: [],
            customerCodeFilters: [],
            destinationOptions: [],
            isEdit: false,
            editVisible: false,
            filteredData: [],
            dialogFormVisible : false,
            shipOrderStatus: '',
            efileVisible: false,
            efiles: [],
            reference: '',
            orderType: 'ShipOrder'
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
      onFilterConfirmed(filter) {
        this.loading = true;
        getFilteredDate('ShipOrder', filter).then(body => {
          this.tableData = body.data.reverse();
          this.filteredData = body.data;
          this.totalEntries = body.data.length
          this.loading = false;

          this.$message({
            message: 'Success!',
            type: 'success'
          });
        })
      },
      onRefreshClicked() {
        this.loading = true;
        getShippingOrders().then(body => {
          this.tableData = body.data.reverse();
          this.totalEntries = body.data.length;
          this.filteredData = body.data;
          this.loading = false;
          this.$message({
            message: 'Success!',
            type: 'success'
          });
        })
      }
    },
    mounted() {
      getShippingOrders().then(body => {
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
      ),
      getCustomerCodeFilters().then(body => {
        this.customerCodeFilters = body.data
      })
    }
}
</script>

<style lang="scss" scoped>
    .input-bar{
      text-align: right
    }
</style>
