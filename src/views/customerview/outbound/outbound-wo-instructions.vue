<template>
  <div>
    <h2>Instructions</h2>
    <div style="margin-bottom:10px">
      <el-button class="gb-button" type="primary" @click="onNewClicked" :disabled="shipOrder.status != 'New Created' && shipOrder.status != 'Picking'">New Instruction</el-button>
    </div>
    <el-table
      :data="instructions"
      ref="table-instructions"
      stripe
      border>
      <el-table-column
        sortable
        prop="id"
        label="Id"
        min-width="5%">
      </el-table-column>
      <el-table-column
        sortable
        prop="description"
        label="Customer's instruction"
        min-width="75%">
      </el-table-column>
      <el-table-column
        prop="handlingStatus"
        label="Status"
        min-width="10%">
      </el-table-column>
      <el-table-column
        prop="operation"
        label="operation"
        min-width="10%">
          <template slot-scope="scope">
            <el-dropdown>
              <span class="el-dropdown-link">
                Operations<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="editkHandler(scope.row.id, scope.row.description)" :disabled="scope.row.handlingStatus != 'Draft'">Edit</el-dropdown-item>
                <el-dropdown-item @click.native="deletHandler(scope.row.id)" divided :disabled="scope.row.handlingStatus != 'Draft'">Delete</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
      </el-table-column>
    </el-table>
    <el-dialog title="Instruction"
      :visible.sync="instructionVisible"
      width="40%"
      top="5vh"
      :lock-scroll="false">
      <el-form ref="form-required" :rules="rules" :model="instruction" label-width="150px">
          <el-form-item label="Instruction" prop="description">
              <el-input type="textarea" v-model="instruction.description" style="width:90%" maxlength="200" show-word-limit></el-input>
          </el-form-item>
      </el-form>
      <div style="text-align:right;margin-right:7%">
          <el-button type="primary" v-if="!isEdit" @click="createHandler">Create</el-button>
          <el-button type="primary" v-if="isEdit" @click="updateHandler">Update</el-button>
          <el-button @click="instructionVisible=false">Cancel</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import { createNewInstructionByCustomer } from '@/api/shipping'
import { updateInstructionByCustomer, deleteInstruction } from '@/api/receiving'

export default {
  props: {
    shipOrder: {},
    instructions: Array
  },
  data() {
      return {
        instructionVisible: false,
        instruction: {
          'id': 0,
          'description': '',
          'isChargingItem': true,
          'result': ''
        },
        isEdit: false,
        rules: {
          description: [
            { required: true, message: 'Please input instruction', trigger: 'change' }
          ]
        }
      };
  },
  methods:{
    onNewClicked() {
      this.instructionVisible = true;
      this.isEdit = false;
      this.instruction.description = '';
    },
    createHandler() {
        this.$refs['form-required'].validate((valid) => {
            if (valid) {
              createNewInstructionByCustomer(this.shipOrder.shipOrderNumber, this.instruction.description).then(body => {
                this.instructions.push(body.data);
                this.instructionVisible = false;
              });
            } else {
                console.log('error submit!!');
                return false;
            }
        });
    },
    editkHandler(id, description) {
      this.instructionVisible = true;
      this.isEdit = true;
      this.instruction.description = description;
      this.instruction.id = id;
    },
    updateHandler() {
        this.$refs['form-required'].validate((valid) => {
            if (valid) {
              updateInstructionByCustomer(this.instruction.id, this.instruction.description).then(body => {
                let index = this.instructions.map(x => x.id).indexOf(this.instruction.id);
                this.instructions.splice(index, 1, body.data);
                this.instructionVisible = false;
              })
            } else {
                console.log('error submit!!');
                return false;
            }
        });
    },
    deletHandler(id) {
      deleteInstruction(id).then(() => {
        let index = this.instructions.map(x => x.id).indexOf(id);
        this.instructions.splice(index, 1);
      })
    },
    deletHandler(id) {
      deleteInstruction(id).then(() => {
        let index = this.instructions.map(x => x.id).indexOf(id);
        this.instructions.splice(index, 1);
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