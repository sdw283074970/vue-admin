  <template>
    <div>
      <h2>Instructions</h2>
      <div style="margin-bottom:10px">
        <el-button class="gb-button" type="primary" @click="onNewClicked">New Instruction</el-button>
        <el-button class="gb-button" type="primary" @click="onResetClicked">Reset Instruction</el-button>
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
          width="60">
        </el-table-column>
        <el-table-column
          prop="description"
          label="Description"
          min-width="90%">
        </el-table-column>
        <el-table-column
          prop="comment"
          label="Comment From Whse"
          min-width="90%">
        </el-table-column>
        <el-table-column
          prop="result"
          label="Reply From Office"
          min-width="90%">
        </el-table-column>
        <el-table-column
          prop="status"
          label="Charging Status"
          min-width="35%">
        </el-table-column>
        <el-table-column
          prop="handlingStatus"
          label="Status"
          min-width="15%">
        </el-table-column>
        <el-table-column
          prop="operation"
          label="operation"
          min-width="25%">
            <template slot-scope="scope">
              <el-dropdown>
                <span class="el-dropdown-link">
                  Operations<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="onUpdateClicked(scope.row.id)">Update</el-dropdown-item>
                  <el-dropdown-item @click.native="onResultClicked(scope.row.id)" v-if="scope.row.handlingStatus=='Pending'||scope.row.handlingStatus=='Updated'">Result</el-dropdown-item>
                  <el-dropdown-item @click.native="deleteHandler(scope.row.id)" divided>Delete</el-dropdown-item>
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
        <picking-wo-instructions-dialog
          :instruction="instruction"
          :isResult="isResult"
          :isEdit="isEdit"
          @onUpdateSucceed="onUpdateSucceed"
          @onCancelClicked="onCancelClicked"
          @onCreatedSucceed="onCreatedSucceed"
          @onResultSucceed="onResultSucceed"
          :shipOrder="shipOrder"></picking-wo-instructions-dialog>
      </el-dialog>
    </div>
  </template>

<script>
/* eslint-disable */

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
        isResult: false,
        isEdit: false
      };
  },
  components:{
    "picking-wo-instructions-dialog": () => import('@/views/officeview/shipping/shipping-wo-instructions-dialog'),
  },
  methods:{
    deleteHandler(id){
      this.$emit('onDeleteClicked', id);
    },
    onResetClicked(){
      this.$emit('onResetClicked');
    },
    onNewClicked(){
      this.isResult = false;
      this.isEdit = false;
      this.instructionVisible = true;
      this.instruction.description = '';
      this.instruction.isChargingItem = true;
    },
    onUpdateClicked(id){
      this.isResult = false;
      this.isEdit = true;
      this.instructionVisible = true;
      let selectedInstru = this.instructions.find(function(i){
        if (i.id == id)
        {
          return i;
        }
      });
      let isChargingItem = selectedInstru.status=='Waiting for charging'?true:false;
      this.instruction.description = selectedInstru.description;
      this.instruction.id = id;
      this.instruction.isChargingItem = isChargingItem;
    },
    onResultClicked(id){
      this.isResult = true;
      this.isEdit = true;
      this.instructionVisible = true;
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