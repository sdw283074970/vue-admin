<template>
  <div class="gb-maincontainer">
    <h1>Inbound Orders Manager</h1>
    <receiving-index-table
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
        <receiving-index-edit-form
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
import { getReceivingOrders, createNewrReceivingOrder, getReceivingOrderInfo, updateReceivingOrderInfo } from '@/api/receiving'
import { getShippingOrders, getCustomerCodes, getAddressCode, getShipOrderInfo, createNewShipOrder, updateShipOrderInfo } from '@/api/shipping'

export default {
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
              container: '',
              customerCode: '',
              eta: '',
              inboundType: '',
              unloadingType: '',
              storageType: '',
              palletizing: '',
              invoiceStatus: 'Await',
              subCustomer: '',
              carrier: '',
              originalPlts: 0,
              containerSize: '',
              vessel: '',
              voy: '',
              etaPort: '',
              placeOfReceipt: '',
              portOfLoading: '',
              portOfDischarge: '',
              placeOfDelivery: '',
              sealNumber: '',
              instruction: ''
            }
        };
    },
    components:{
        "receiving-index-edit-form": () => import('@/views/officeview/receiving/index-edit-form'),
        "receiving-index-table": () => import('@/views/officeview/receiving/index-table')
    },
    watch:{
      search: function(val, oldVal){
        this.filteredData = this.tableData.filter(data => {
            return Object.keys(data).some(key => {
              return String(data[key]).toLowerCase().indexOf(this.search.toLowerCase()) > -1
          })
        })
        this.totalEntries = this.filteredData.length;
      }
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
        createNewrReceivingOrder(this.formData).then(body => {
          this.$message({
            message: 'Success!',
            type: 'success'
          });
          this.editVisible = false;
          this.filteredData.splice(0, 0, body.data);
        })
      },
      onEditConfirmedClicked(id){
        updateReceivingOrderInfo(id, this.formData).then(body => {
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
            status: '',
            container: '',
            customerCode: '',
            eta: '',
            originalPlts: 0,
            inboundType: '',
            unloadingType: '',
            storageType: '',
            palletizing: '',
            invoiceStatus: 'Await',
            subCustomer: '',
            carrier: '',
            containerSize: '',
            vessel: '',
            voy: '',
            etaPort: '',
            placeOfReceipt: '',
            portOfLoading: '',
            portOfDischarge: '',
            placeOfDelivery: '',
            sealNumber: '',
            instruction: ''
        }
      },
      onEidtClicked(id){
        this.editVisible = true;
        this.isEdit = true;
        getReceivingOrderInfo(id).then(body => {
          this.formData = body.data
        })
      }
    },
    mounted() {
        getReceivingOrders().then(
            body => {
                this.tableData = body.data.reverse();
                this.filteredData = body.data;
                this.totalEntries = body.data.length
                this.loading = false;

                // body.data.forEach(element => {
                //     var newObj = {"text" : element.customerCode, "value" : element.customerCode};
                //     this.customerCodeFilter.push(newObj);
                // });
            }
        ),
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
