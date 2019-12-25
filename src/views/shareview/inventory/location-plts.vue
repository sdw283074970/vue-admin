<template>
  <div v-if="!isCtnView">
    <div style="text-align:right">
      <el-input
        v-model="search"
        style="width:250px"
        size="large"
        placeholder="Search..."
      />
    </div>
    <el-table
      ref="location-ctns"
      show-summary
      :data="localTableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      stripe
      border
      :height="tableHight"
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="Ctn Id"
        width="70"
      />
      <el-table-column
        prop="container"
        label="Container"
        width="120"
      />
      <el-table-column
        prop="type"
        align="center"
        label="Storage Type"
        width="120"
      />
      <el-table-column
        prop="shipmentId"
        label="Shipment Id/SKU"
        min-width="60%"
      />
      <el-table-column
        prop="amzRefId"
        label="Amz Ref Id"
        min-width="60%"
      />
      <el-table-column
        prop="warehouseCode"
        label="Whse Code"
        width="110"
      />
      <el-table-column
        prop="grossWeightPerCtn"
        label="GW/CTN"
        width="80"
        align="center"
      />
      <el-table-column
        prop="cbmPerCtn"
        label="CBM/CTN"
        width="100"
        align="center"
      />
      <el-table-column
        prop="originalQuantity"
        label="Received Ctns"
        align="center"
        width="120"
      />
      <el-table-column
        prop="residualQuantity"
        align="center"
        label="Ava Ctns"
        width="100"
      />
      <el-table-column
        prop="pickingCtns"
        align="center"
        label="Processing Ctns"
        width="100"
      />
      <el-table-column
        prop="holdQuantity"
        align="center"
        label="Hold Ctns"
        width="100"
      />
      <el-table-column
        prop="location"
        label="Location"
      />
      <el-table-column
        prop="operation"
        label="operation"
        align="center"
        width="110"
      >
        <template slot-scope="scope">
          <el-button @click="onHistoryClicked(scope.row.id)">History</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top:10px"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="20"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalEntries"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
/* eslint-disable */

export default {
    props: {
        fbaCtnInventories: Array,
        isCtnView: Boolean
    },
    data(){
        return {
            tableHight: window.innerHeight * 0.6,
            currentPage: 1,
            pageSize: 20,
            search: '',
            totalEntries: 0,
            localTableData: []
        }
    },
    watch:{
        search: function(val, oldVal){
            this.onSearchChanged(val);
        },
        fbaCtnInventories: function(val, oldVal){
            this.localTableData = this.fbaCtnInventories;
            this.totalEntries = this.localTableData.length;
        }
    },
    methods:{
      onSearchChanged(search) {
          this.currentPage = 1;
        this.localTableData = this.fbaCtnInventories.filter(data => {
            return Object.keys(data).some(key => {
              return String(data[key]).toLowerCase().indexOf(search.toLowerCase()) > -1
          })
        })
        this.totalEntries = this.localTableData.length;
      },
      handleSizeChange(val) {
        this.pageSize = val;
      },
      handleCurrentChange(val) {
        this.currentPage = val;
      },
      onHistoryClicked(id) {
        this.$emit('onCtnHistoryClicked', id);
      }
    },
    mounted() {

    },
}
</script>

<style lang="scss" scoped>
    .input-bar{
      text-align: right
    }
</style>
