<template>
  <div>
    <el-button type="primary" style="margin:10px" icon="el-icon-plus" @click="onNewClicked">New Instruction Template</el-button>
    <el-table
      ref="label-files-table"
      :data="templates"
      stripe
      border
      height="500"
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="Id"
        width="60"
      />
      <el-table-column
        prop="description"
        label="Description"
      />
      <el-table-column
        prop="isApplyToMasterOrder"
        label="Master Order"
        width="110"
        align="center"
      >
        <template
          slot-scope="scope"
        >
          <font>{{ scope.row.isApplyToMasterOrder?'√':'X' }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="isApplyToShipOrder"
        label="Ship Order"
        align="center"
        width="110"
      >
        <template
          slot-scope="scope"
        >
          <font>{{ scope.row.isApplyToShipOrder?'√':'X' }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="isInstruction"
        label="Is Instruction"
        align="center"
        width="110"
      >
        <template
          slot-scope="scope"
        >
          <font>{{ scope.row.isInstruction?'√':'X' }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="isOperation"
        label="Is Operation"
        align="center"
        width="110"
      >
        <template
          slot-scope="scope"
        >
          <font>{{ scope.row.isOperation?'√':'X' }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="isCharging"
        align="center"
        label="Is Charging"
        width="110"
      >
        <template
          slot-scope="scope"
        >
          <font>{{ scope.row.isCharging?'√':'X' }}</font>
        </template>
      </el-table-column>
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

    <el-dialog title="Instruction Template" :visible.sync="dialogVisible" top="10vh" width="800px" append-to-body>
      <template-dialog :is-edit="isEdit" :template="template" :customer-id="customerId" @reloadTemplates="reloadTemplates" @closeDialog="closeDialog" />
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
    templates: Array,
    customerId: Number
  },
  data() {
    return {
        isEdit: false,
        dialogVisible: false,
        template: {
            id: 0,
            description: '',
            isInstruction: false,
            isOperation: false,
            isCharging: false,
            isApplyToMasterOrder: false,
            isApplyToShipOrder: false,
            isApplyToAll: false
        }
    }
  },
  components: {
      "template-dialog": () => import('@/views/officeview/customer/template-dialog'),
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
