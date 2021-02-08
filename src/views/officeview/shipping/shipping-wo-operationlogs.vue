<template>
  <div id="csr-all-wo-instruction">
    <h2>Operation Logs</h2>
    <el-table
      id="csr-all-wo-instruction-table"
      ref="table-instructions"
      :data="logs"
      stripe
      border
    >
      <el-table-column
        sortable
        prop="id"
        label="Id"
        width="60"
      />
      <el-table-column
        prop="description"
        label="Description"
        min-width="90%"
      />
      <el-table-column
        prop="type"
        label="Type"
        align="center"
        width="100"
      />
      <el-table-column
        prop="operator"
        label="Operator"
        align="center"
        width="180"
      />
      <el-table-column
        prop="operationDate"
        label="Operation Date"
        align="center"
        width="150"
      >
        <template slot-scope="scope">
          <font>{{ transferDate(scope.row.operationDate) }}</font>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
/* eslint-disable */
import { deleteInstruction } from '@/api/shipping'
import { changeChargingStatus } from '@/api/accounting'
import { csr_all_wo_instruction } from '@/guide/steps'

export default {
  props: {
    shipOrder: {},
    logs: Array,
    instructions: Array,
    step: Number
  },
  data() {
      return {
        driver: null,
        instructionVisible: false,
        popVisible: false,
        orderType: 'ShipOrder',
        instruction: {
          id: 0,
          description: '',
          isChargingItem: true,
          isInstruction: false,
          isOperation: false,
          result: '',
          reference: '',
          orderType: 'ShipOrder'
        },
        isResult: false,
        isEdit: false
      };
  },
  components:{
    "picking-wo-instructions-dialog": () => import('@/views/officeview/shipping/shipping-wo-instructions-dialog'),
  },
  methods:{
    transferDate: function(date) {
      return date === undefined ? '' : (date.substring(0, 4) === '1900' ? '-' : date.substring(0, 10))
    }
  },
  mounted() {
    this.driver = new this.$driver()
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
    .el-icon-arrow-down {
      font-size: 12px;
    }
    .demonstration {
      display: block;
      color: #8492a6;
      font-size: 14px;
      margin-bottom: 20px;
    }
</style>