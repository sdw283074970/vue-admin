  <template>
    <div>
      <h1>Register Pallets Info</h1>
      <h2>Container: {{ masterOrder.container }}</h2>
      <h2>Customer: {{ masterOrder.customerCode }}</h2>
      <el-table
          :data="orderDetails"
          ref="table"
          stripe
          border
          height="500"
          style="width: 100%">
          <el-table-column
          sortable
          prop="id"
          label="Rcv Id"
          width="100">
          </el-table-column>
          <el-table-column
          prop="shipmentId"
          sortable=""
          label="Shipment Id/SKU"
          min-width="60%">
          </el-table-column>
          <el-table-column
          prop="amzRefId"
          sortable=""
          label="Amz Ref Id"
          min-width="60%">
          </el-table-column>
          <el-table-column
          prop="warehouseCode"
          label="Whse Code"
          min-width="30%">
          </el-table-column>
          <el-table-column
          prop="howToDeliver"
          label="Delivery"
          min-width="30%">
          </el-table-column>
          <el-table-column
          prop="actualGrossWeight"
          label="G.W."
          min-width="20%">
          </el-table-column>
          <el-table-column
          prop="actualCBM"
          label="CBM"
          min-width="20%">
          </el-table-column>
          <el-table-column
          prop="actualQuantity"
          label="Quantity"
          min-width="30%">
          </el-table-column>
          <el-table-column
          label="TBA"
          min-width="30%">
              <template slot-scope="scope">
                  <font>{{ scope.row.actualQuantity - scope.row.comsumedQuantity }}</font>
              </template>
          </el-table-column>
          <el-table-column
              type="selection"
              width="60">
          </el-table-column>
      </el-table>
      <div style="margin-top:10px;text-align:right;">
          <el-button disabled>Detail Pack</el-button>
          <el-button @click="packVisible = true">Rough Pack</el-button>
      </div>
      <el-dialog title="Rough Pack"
          :visible.sync="packVisible"
          width="450px"
          :lock-scroll="false"
          append-to-body>
              <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" class="demo-ruleForm">
                  <el-form-item label="Packed Plt Quantity" prop="pltNumber">
                      <el-input v-model.number="ruleForm.pltNumber"></el-input>
                  </el-form-item>
                  <el-form-item label="Packed PLt Size" prop="pltSize">
                      <el-select v-model="ruleForm.pltSize" placeholder="Select Size">
                      <el-option label="P1(Standard Size)" value="P1"></el-option>
                      <el-option label="P2(2X Standard Size)" value="P2"></el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item>
                      <el-button @click="submitForm('ruleForm')">Pack</el-button>
                      <el-button @click="resetForm('ruleForm')">Reset</el-button>
                  </el-form-item>
              </el-form>
      </el-dialog>
    </div>
  </template>
<script>
/* eslint-disable */

const validateAcquaintance = (rule, value, callback) => {
  if (!value) {
    callback(new Error('Please enter valid pallet number'))
  }
  value = Number(value)
  if (typeof value === 'number' && !isNaN(value)) {
    if (value < 1) {
      callback(new Error('Pallet number cannot be smaller than 1'))
    } else {
      callback()
    }
  } else {
    callback(new Error('Please enter valid pallet number'))
  }
}

export default {
  props: {
    masterOrder: {},
    orderDetails: Array
  },
  data() {
      return {
          step: 0,
          search: '',
          filteredData : [],
          packVisible: false,
          totalEntries: 0,
          currentPage: 1,
          pageSize: 20,
          formLabelWidth : '200px',
          customerCodeFilter : [],
            ruleForm: {
                pltNumber: '',
                pltSize: 'P1'
            },
            rules: {
            pltNumber: [
                    { validator: validateAcquaintance, trigger: 'blur' }                    
                ],
            pltSize: [
                    { required: true, message: 'Please select size', trigger: 'change' },
                ]
            }
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
    },
    handleSizeChange(val) {
        this.pageSize = val;
    },
    handleCurrentChange(val) {
        this.currentPage = val;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
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
</style>
