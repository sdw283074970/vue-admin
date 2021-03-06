<template>
  <div id="csr-all-wo-instruction">
    <h2>Instruction & Operation & Charging Notes</h2>
    <div style="margin-bottom:10px">
      <el-button id="csr-all-wo-instruction-new" class="gb-button" type="primary" icon="el-icon-plus" :disabled="masterOrder.invoiceStatus=='Closed'" @click="onNewClicked">New</el-button>
      <el-popover
        v-model="popVisible"
        placement="top"
        width="380"
      >
        <p>All existed instructions & chargings will be overwritten.</p>
        <p>Are you sure you want to continue?</p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="popVisible = false">No</el-button>
          <el-button type="primary" size="mini" @click="onResetClicked">Yes</el-button>
        </div>
        <el-button id="csr-all-wo-instruction-reset" slot="reference" class="gb-button" type="primary" :disabled="step>2||masterOrder.invoiceStatus=='Closed'">Reset Instruction</el-button>
      </el-popover>
      <el-button icon="el-icon-info" @click.prevent.stop="guide">Guide</el-button>
    </div>
    <el-table
      id="csr-all-wo-instruction-table"
      ref="table-instructions"
      :data="instructions"
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
        prop="comment"
        label="Comment From Whse"
        min-width="90%"
      />
      <el-table-column
        prop="result"
        label="Reply From Office"
        min-width="90%"
      />
      <el-table-column
        label="Visibility"
        align="center"
      >
        <el-table-column
          label="Customer"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <font>{{ scope.row.isInstruction ? '√' : 'X' }}</font>
          </template>
        </el-table-column>
        <el-table-column
          label="Warehouse"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <font>{{ scope.row.isInstruction||scope.row.isOperation ? '√' : 'X' }}</font>
          </template>
        </el-table-column>
        <el-table-column
          label="Agent"
          align="center"
          width="100"
          v-if="!checkPermission(['trainee'])"
        >
          <template slot-scope="scope">
            <font>{{ scope.row.visibleToAgent? '√' : 'X' }}</font>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        prop="status"
        label="Charging Status"
        align="center"
        width="180"
      />
      <el-table-column
        prop="handlingStatus"
        label="Status"
        align="center"
        width="100"
      />
      <el-table-column
        prop="operation"
        label="operation"
        width="110"
      >
        <template slot-scope="scope">
          <el-dropdown>
            <span class="el-dropdown-link">
              Operations<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :disabled="scope.row.handlingStatus=='Finished'||scope.row.handlingStatus=='Confirmed'||masterOrder.invoiceStatus=='Closed'" @click.native="onUpdateClicked(scope.row.id)">Update</el-dropdown-item>
              <el-dropdown-item :disabled="!(scope.row.handlingStatus=='Pending'||scope.row.handlingStatus=='Updated')" @click.native="onResultClicked(scope.row.id)">Result</el-dropdown-item>
              <el-dropdown-item :disabled="masterOrder.invoiceStatus=='Closed'" divided @click.native="onChangeStatusClicked(scope.row.id)">Change Charging Mark</el-dropdown-item>
              <el-dropdown-item :disabled="masterOrder.invoiceStatus=='Closed'" divided @click.native="deleteHandler(scope.row.id)">Delete</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="Instruction & Charging"
      :visible.sync="instructionVisible"
      width="40%"
      top="5vh"
      :before-close="handleClose"
      :lock-scroll="false"
    >
      <picking-wo-instructions-dialog
        :instruction="instruction"
        :is-result="isResult"
        :is-edit="isEdit"
        :step="step"
        :reference="masterOrder.container"
        :order-type="orderType"
        @onUpdateSucceed="onUpdateSucceed"
        @onCancelClicked="onCancelClicked"
        @onCreatedSucceed="onCreatedSucceed"
        @onResultSucceed="onResultSucceed"
      />
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import { getInstructions } from '@/api/receiving'
import { deleteInstruction } from '@/api/shipping'
import { changeChargingStatus } from '@/api/accounting'
import { csr_all_wo_instruction } from '@/guide/steps'
import checkPermission from '@/utils/permission' // 权限判断函数

export default {
  props: {
    masterOrder: {},
    instructions: Array,
    step: Number
  },
  data() {
      return {
        instructionVisible: false,
        popVisible: false,
        orderType: 'MasterOrder',
        instruction: {
          id: 0,
          description: '',
          isChargingItem: true,
          isInstruction: false,
          isOperation: false,
          visibleToAgent: true,
          result: '',
          reference: '',
          orderType: 'MasterOrder'
        },
        isResult: false,
        isEdit: false
      };
  },
  components:{
    "picking-wo-instructions-dialog": () => import('@/views/officeview/shipping/shipping-wo-instructions-dialog'),
  },
  methods:{
    checkPermission,
    handleClose(done) {
      this.$confirm('Are you want to close this dialog？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    guide() {
      this.driver.defineSteps(csr_all_wo_instruction)
      this.driver.start()
    },
    deleteHandler(id){
      deleteInstruction(id).then(() => {
        let index = this.instructions.map(x => x.id).indexOf(id)
        this.instructions.splice(index, 1)
        this.$message({
          message: 'Delete succeed',
          type: 'success'
        })
      })
    },
    onResetClicked(){
      this.popVisible = false;
      this.$emit('onResetClicked');
    },
    onNewClicked(){
      this.isResult = false;
      this.isEdit = false;
      this.instructionVisible = true;
      this.instruction.description = '';
      this.instruction.isChargingItem = true;
      this.instruction.isInstruction = false;
      this.instruction.isOperation = false;
      this.instruction.reference = this.masterOrder.container;
    },
    onUpdateClicked(id){
      this.isResult = false;
      this.isEdit = true;
      this.instructionVisible = true;
      this.instruction.reference = this.masterOrder.container;
      let selectedInstru = this.instructions.find(function(i){
        if (i.id == id)
        {
          return i;
        }
      });
      let isChargingItem = selectedInstru.isCharging;
      let isInstruction = selectedInstru.isInstruction;
      this.instruction.description = selectedInstru.description;
      this.instruction.id = id;
      this.instruction.isOperation = selectedInstru.isOperation;
      this.instruction.isChargingItem = isChargingItem;
      this.instruction.isInstruction = isInstruction;
    },
    onResultClicked(id){
      this.isResult = true;
      this.isEdit = true;
      this.instructionVisible = true;
      this.instruction.reference = this.masterOrder.container;
      let selectedInstru = this.instructions.find(function(i){
        if (i.id == id)
        {
          return i;
        }
      });
      this.instruction.result = selectedInstru.result;
      this.instruction.id  = id;
    },
    onCancelClicked(){
      this.instructionVisible = false;
    },
    onChangeStatusClicked(id) {
      changeChargingStatus(id).then(() => {
        this.$emit('referashInstructions');
      })
    },
    onCreatedSucceed(data){
      this.instructions.push(data);
      this.$message({
      message: 'Created succeed',
      type: 'success'
      });
    },
    onUpdateSucceed(){
      this.$emit('referashInstructions');
      this.$message({
      message: 'Update succeed',
      type: 'success'
      });
    },
    onResultSucceed(){
      this.$emit('referashInstructions');
      this.$message({
      message: 'Send result succeed',
      type: 'success'
      });
    }
  },
  mounted() {
    this.driver = new this.$driver()
      // getInstructions(this.$route.params.masterOrderId).then(body => {
      //     this.instructions = body.data.operationInstructions;
      // })
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
