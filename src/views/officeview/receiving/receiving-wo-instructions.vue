  <template>
    <div>
      <h2>Instructions</h2>
      <div style="margin-bottom:10px">
        <el-button class="gb-button" type="primary">New Instruction</el-button>
        <el-button class="gb-button" type="primary">Reset Instruction</el-button>
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
          min-width="120%">
        </el-table-column>
        <el-table-column
          prop="comment"
          label="Comment From Whse"
          min-width="120%">
        </el-table-column>
        <el-table-column
          prop="result"
          label="Reply From Office"
          min-width="120%">
        </el-table-column>
        <el-table-column
          prop="status"
          label="Charging Status"
          min-width="60%">
        </el-table-column>
        <el-table-column
          prop="handlingStatus"
          label="Status"
          min-width="40%">
        </el-table-column>
        <el-table-column
          prop="operation"
          label="operation">
            <template slot-scope="scope">
              <el-dropdown>
                <span class="el-dropdown-link">
                  Operations<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="editkHandler(scope.row.id)">Edit</el-dropdown-item>
                  <el-dropdown-item @click.native="deletHandler(scope.row.id)" divided>Delete</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
        </el-table-column>
      </el-table>
    </div>
  </template>

<script>
/* eslint-disable */
import { getInstructions } from '@/api/receiving'

export default {
  props: {
    masterOrder: {}
  },
  data() {
      return {
          instructions: [],
          search: ''
      };
  },
  methods:{
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    filterChange(filters){
      console.log(filters);
    },
    clearFilter() {
      this.$refs.table.clearFilter();
    }
  },
  mounted() {
      getInstructions(this.$route.params.masterOrderId).then(body => {
          this.instructions = body.data.operationInstructions;
      })
  }
}
</script>

<style lang="scss" scoped>
    .input-bar{
      text-align: right
    }
</style>
