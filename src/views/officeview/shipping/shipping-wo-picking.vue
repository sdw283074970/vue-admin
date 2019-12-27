<template>
  <div>
    <h2>Picking List</h2>
    <el-button class="gb-button" :disabled="shipOrder.status != 'New Created'&&shipOrder.status != 'Picking'" type="primary" @click="pltsTableVisible = true">Pick Plts</el-button>
    <el-button class="gb-button" :disabled="shipOrder.status != 'New Created'&&shipOrder.status != 'Picking'" type="primary" @click="ctnsTableVisible = true">Pick Ctns</el-button>
    <el-input
      v-model="search"
      style="width:250px"
      size="large"
      placeholder="Search..."
    />
    <el-table
      ref="table"
      :data="pickDetails"
      stripe
      show-summary
      border
      style="width: 100%"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table
            ref="pick-table-plts-ctns"
            :data="props.row.fbaCartonLocations"
            border
            stripe
          >
            <el-table-column
              sortable
              prop="id"
              label="Ctn Id"
              width="80"
            />
            <el-table-column
              sortable
              prop="shipmentId"
              label="SKU"
              width="200"
            />
            <el-table-column
              sortable
              prop="amzRefId"
              label="Amz Ref Id"
              width="200"
            />
            <el-table-column
              prop="warehouseCode"
              label="Whse Code"
              width="100"
            />
            <el-table-column
              prop="grossWeightPerCtn"
              label="GW/Ctn"
              width="100"
            />
            <el-table-column
              prop="cbmPerCtn"
              label="CBM/Ctn"
              width="100"
            />
            <el-table-column
              prop="actualQuantity"
              label="Org Ctns"
              width="100"
            />
            <el-table-column
              prop="availableCtns"
              label="Ava Ctns"
              width="100"
            />
            <el-table-column
              prop="pickingCtns"
              label="Picking Ctns"
              width="120"
            />
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        prop="id"
        label="Id"
        width="60"
      />
      <el-table-column
        prop="container"
        label="Container #"
        sortable=""
        width="200"
      />
      <el-table-column
        prop="shipmentId"
        sortable=""
        label="Shipment Id/SKU"
        width="200"
      />
      <el-table-column
        prop="amzRefId"
        sortable=""
        label="Amz Ref Id"
        width="200"
      />
      <el-table-column
        prop="warehouseCode"
        label="Whse Code"
        width="100"
      />
      <el-table-column
        prop="pickableCtns"
        label="Pickable Ctns"
        width="120"
      />
      <el-table-column
        prop="actualQuantity"
        label="Pick Ctns"
        width="100"
      />
      <el-table-column
        prop="pltsFromInventory"
        label="Pick Plts"
        width="100"
      />
      <el-table-column
        prop="newPlts"
        label="Built Plts"
        width="100"
      />
      <el-table-column
        prop="actualPlts"
        label="Ttl Plts"
        width="100"
      />
      <el-table-column
        prop="location"
        label="Location"
      />
      <el-table-column
        prop="operation"
        label="operation"
        width="130"
      >
        <template slot-scope="scope">
          <el-dropdown v-if="operationVisible">
            <span class="el-dropdown-link">
              Operations<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="pickVisible" @click.native="putbackHandler(scope.row.id)">Put back</el-dropdown-item>
              <el-dropdown-item>Adjust</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="Inventory(Pallets View)"
      :visible.sync="pltsTableVisible"
      width="85%"
      top="5vh"
      :lock-scroll="false"
    >
      <picking-plts @referashPickDetails="referashPickDetails" />
    </el-dialog>
    <el-dialog
      title="Inventory(Cartons View)"
      :visible.sync="ctnsTableVisible"
      width="85%"
      top="5vh"
      :lock-scroll="false"
    >
      <picking-ctns />
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import { getSO, putbackPickDetail } from '@/api/shipping'

export default {
  props: {
    shipOrder: {},
    pickDetails: Array,
    step: 0,
  },
  watch: {
    step: function(val){
      if (val > 1)
        this.pickVisible = false;
      
      if (val > 3)
        this.operationVisible = false;
    }
  },
  components:{
    "picking-plts": () => import('@/views/officeview/shipping/shipping-wo-picking-plts'),
    "picking-ctns": () => import('@/views/officeview/shipping/shipping-wo-picking-ctns')
  },
  data() {
      return {
          pickVisible: true,
          operationVisible: true,
          search: '',
          filteredData : [],
          totalEntries: 0,
          currentPage: 1,
          pageSize: 20,
          pltsTableVisible : false,
          ctnsTableVisible : false,
          formLabelWidth : '200px',
          customerCodeFilter : []
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
    putbackHandler(id){
      putbackPickDetail(id).then(() => {
          let index = this.pickDetails.map(o => o.id).indexOf(id)
          this.pickDetails.splice(index, 1);
          this.$message({
            message: 'Pick Id ' + id + ' has been put back successfully',
            type: 'success'
          });
        }
      )
    },
    referashPickDetails(){
      this.$emit('referashPickDetails');
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
