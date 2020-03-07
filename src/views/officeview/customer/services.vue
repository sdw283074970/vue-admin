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
      <services-dialog :is-edit="isEdit" :service="service" :customer-id="customerId" @reloadTemplates="reloadTemplates" @closeDialog="closeDialog" />
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import config from '@/scripts/global'
import { getInstructionTemplate, deleteInstructionTemplate } from '@/api/customer'

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
        this.dialogVisible = true,
        this.isEdit = false,
        this.template = {
            id: 0,
            description: '',
            isInstruction: false,
            isOperation: false,
            isCharging: false,
            isApplyToMasterOrder: false,
            isApplyToShipOrder: false,
            isApplyToAll: false
        }
    },
    onEditClicked(id) {
        this.isEdit = true,
        getInstructionTemplate(id).then(body => {
            this.template = body.data
            this.dialogVisible = true
            this.template.isApplyToAll = false
        })
    },
    reloadTemplates() {
      this.dialogVisible = false
      this.$emit('reloadTemplates')
    },
    closeDialog() {
      this.dialogVisible = false
    },
    onDeleteClicked(id) {
      deleteInstructionTemplate(id).then(() => {
        this.$emit('reloadTemplates')
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
