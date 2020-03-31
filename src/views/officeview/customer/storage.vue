<template>
  <div>
    <el-button type="primary" style="margin:10px" icon="el-icon-plus" @click="onNewClicked">New Storage Template</el-button>
    <el-table
      ref="label-files-table"
      :data="storagePriceTable"
      stripe
      border
      height="500"
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="Id"
        align="center"
        sortable
        width="60"
      />
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
          <el-dropdown>
            <span class="el-dropdown-link">
              Options<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="onEditClicked(scope.row.id)">Edit</el-dropdown-item>
              <el-dropdown-item @click.native="onDetailClicked(scope.row.id)">Details</el-dropdown-item>
              <el-dropdown-item divided @click.native="onDeleteClicked(scope.row.id)">Delete</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="Storage Templates" :visible.sync="dialogVisible" top="10vh" width="400px" append-to-body>
      <storage-dialog :is-edit="isEdit" :storage-temp="storageTemp" :customer-id="customerId" @reloadStorage="reloadStorage" @closeDialog="closeDialog" />
    </el-dialog>

    <el-dialog title="Storage Template Details" :visible.sync="detailVisible" top="10vh" width="900px" append-to-body>
      <storage-details :storage-temp="storageTemp" :temp-details="tempDetails" :customer-id="customerId" @reloadStorage="reloadStorage" @closeDetailOnly="closeDetailOnly" />
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import config from '@/scripts/global'
import { getStorageTemp, deleteStorageTemp, getTempDetails } from '@/api/customer'

const baseURL = config.baseURL

export default {
  props: {
    storagePriceTable:Array,
    customerId: Number,
    customerCode: String
  },
  data() {
    return {
        isEdit: false,
        dialogVisible: false,
        detailVisible: false,
        tempDetails: [],
        storageTemp: {
          templateName: '',
          customerCode: '',
          chargePeriod: '',
          currency: ''
        }
    }
  },
  components: {
      "storage-dialog": () => import('@/views/officeview/customer/storage-dialog'),
      "storage-details": () => import('@/views/officeview/customer/storage-details')
  },
  methods:{
    transferDate: function(date){
        return date.substring(0,10);
    },
    onNewClicked() {
        this.isEdit = false
        let id = this.customerId
        let code = this.customerCode
        this.storageTemp = {
          templateName: '',
          customerCode: code,
          chargePeriod: '',
          currency: ''
        }
        this.dialogVisible = true
    },
    onEditClicked(id) {
        this.isEdit = true
        getStorageTemp(id).then(body => {
            this.storageTemp = body.data
            this.storageTemp.customerCode = this.customerCode
            this.storageTemp.chargePeriod = body.data.timeUnit
            this.dialogVisible = true
        })
    },
    onDetailClicked(id) {
      getStorageTemp(id).then(body => {
          this.storageTemp = body.data
          this.storageTemp.customerCode = this.customerCode
          this.storageTemp.chargePeriod = body.data.timeUnit
          getTempDetails(id).then(body => {
              this.tempDetails = body.data
              this.detailVisible = true
          }) 
      })
    },
    reloadStorage() {
      this.dialogVisible = false
      this.detailVisible = false
      this.$emit('reloadStorage')
    },
    closeDialog() {
      this.dialogVisible = false
      this.detailVisible = false
    },
    closeDetailOnly() {
      this.detailVisible = false
    },
    onDeleteClicked(id) {
      deleteStorageTemp(id).then(() => {
        this.$emit('reloadStorage')
      })
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

    .el-dropdown-link {
      cursor: pointer;
      color: #409EFF;
    }
</style>
