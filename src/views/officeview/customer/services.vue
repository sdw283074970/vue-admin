<template>
  <div>
    <el-button type="primary" style="margin:10px" icon="el-icon-plus" @click="onNewClicked">New Service</el-button>
    <el-table
      ref="label-files-table"
      :data="services"
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
        prop="chargingType"
        label="Service Type"
        sortable
        width="150"
        align="center"
      />
      <el-table-column
        prop="name"
        label="Service Name"
        sortable
        width="200"
        align="center"
      />
      <el-table-column
        prop="rate"
        label="Rate"
        sortable
        width="110"
        align="center"
      >
        <template
          slot-scope="scope"
        >
          <font>{{ '$ ' + scope.row.rate.toFixed(2) }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="unit"
        sortable
        width="110"
        align="center"
        label="UOM"
      />
      <el-table-column
        prop="description"
        label="Service Description"
      />
      <el-table-column
        prop="operation"
        align="center"
        label="operation"
        width="110"
      >
        <template slot-scope="scope">
          <el-dropdown>
            <span class="el-dropdown-link">
              Options<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="onEditClicked(scope.row.id)">Edit</el-dropdown-item>
              <el-dropdown-item @click.native="onDeleteClicked(scope.row.id)">Delete</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="Services" :visible.sync="dialogVisible" top="10vh" width="400px" append-to-body>
      <services-dialog :is-edit="isEdit" :service="service" :customer-id="customerId" @reloadServices="reloadServices" @closeDialog="closeDialog" />
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import config from '@/scripts/global'
import { getService, deleteService } from '@/api/customer'

const baseURL = config.baseURL

export default {
  props: {
    services:Array,
    templates: Array,
    customerId: Number
  },
  data() {
    return {
        isEdit: false,
        dialogVisible: false,
        service: {
          chargingType: '', 
          customerId: 0,
          description: '',
          isApplyToAll: false,
          name: '',
          rate: 0,
          unit: ''
        },
    }
  },
  components: {
      "services-dialog": () => import('@/views/officeview/customer/services-dialog'),
  },
  methods:{
    transferDate: function(date){
        return date.substring(0,10);
    },
    onNewClicked() {
        this.isEdit = false
        let id = this.customerId
        this.service = {
          chargingType: '', 
          customerId: id,
          description: '',
          isApplyToAll: false,
          name: '',
          rate: 0,
          unit: ''
        }
        this.dialogVisible = true
    },
    onEditClicked(id) {
        this.isEdit = true
        let cid = this.customerId
        getService(id).then(body => {
            this.service = body.data
            this.service.customerId = cid
            this.dialogVisible = true
        })
    },
    reloadServices() {
      this.dialogVisible = false
      this.$emit('reloadServices')
    },
    closeDialog() {
      this.dialogVisible = false
    },
    onDeleteClicked(id) {
      deleteService(id).then(() => {
        this.$emit('reloadServices')
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
