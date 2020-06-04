<template>
  <div class="gb-maincontainer">
    <h1>Receiving Manager</h1>
    <receiving-index-table
      :table-data="tableData"
      :loading="loading"
      :customer-code-filters="customerCodeFilters"
      :destination-options="destinationOptions"
      :customer-code-options="customerCodeOptions"
      @onEfilesClicked="onEfilesClicked"
      @onSearchChanged="onSearchChanged"
      @onFilterConfirmed="onFilterConfirmed"
      @onRefreshClicked="onRefreshClicked"
      @onFilterFinish="onFilterFinish"
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
          @reloadEFiles="onEfilesClicked"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { getReceivingOrders, createNewrReceivingOrder, getReceivingOrderInfo, updateReceivingOrderInfo, getEfiles, getCustomerCodeFilters, getFilteredDate, getFilteredMasterOrders } from '@/api/receiving'
import { getShippingOrders, getCustomerCodes, getAddressCode, getShipOrderInfo, createNewShipOrder, updateShipOrderInfo } from '@/api/shipping'

export default {
    name: 'accounting-receiving-index',
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
            filterVisible: false,
            filteredData: [],
            dialogFormVisible : false,
            efileVisible: false,
            efiles: [],
            reference: '',
            orderType: 'MasterOrder'
        };
    },
    components:{
        "receiving-index-table": () => import('@/views/accountingview/receiving/index-table'),
        "generic-efiles": () => import('@/views/shareview/generic/generic-efiles')
    },
    watch:{
      // search: function(val, oldVal){
      //   this.filteredData = this.tableData.filter(data => {
      //       return Object.keys(data).some(key => {
      //         return String(data[key]).toLowerCase().indexOf(this.search.toLowerCase()) > -1
      //     })
      //   })
      //   this.totalEntries = this.filteredData.length;
      // }
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
      onEfilesClicked(reference) {
        this.efileVisible = true;
        this.reference = reference;
        getEfiles(reference, this.orderType).then(body => {
          this.efiles = body.data
        })
      },
      onFilterConfirmed(filter) {
        this.loading = true;
        getFilteredDate('MasterOrder', filter).then(body => {
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
        getReceivingOrders().then(body => {
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
      onFilterFinish(filter) {
        this.loading = true;
        getFilteredMasterOrders(filter).then(body => {
          this.tableData = body.data;
          this.filteredData = body.data;
          this.totalEntries = body.data.length
          this.loading = false;
          this.$message({
            message: 'Success!',
            type: 'success'
          });
        })
      }
    },
    mounted() {
      getReceivingOrders().then(body => {
        this.tableData = body.data.reverse();
        this.filteredData = body.data;
        this.totalEntries = body.data.length
        this.loading = false;
      }),
      getCustomerCodes().then(body => {
        this.customerCodeOptions = body.data
      }),
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
