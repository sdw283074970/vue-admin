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
      ref="location-plts"
      show-summary
      :data="localTableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      stripe
      border
      :height="tableHight"
      style="width: 100%"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table
            ref="pick-table-plts-ctns"
            :data="props.row.inPalletCtnInventories"
            border
            show-summary
            stripe
          >
            <el-table-column
              prop="id"
              label="Ctn Id"
              width="70"
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
              prop="subCustomer"
              label="Sub-customer"
              width="110"
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
              width="90"
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
              width="120"
            />
            <el-table-column
              prop="operation"
              label="operation"
              align="center"
              width="110"
            >
              <template slot-scope="scope">
                <el-button @click="onCtnHistoryClicked(scope.row.id)">History</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        prop="pltId"
        label="Plt Id"
        width="70"
      />
      <el-table-column
        prop="container"
        label="Container"
        width="200"
      />
      <el-table-column
        prop="subCustomer"
        align="center"
        label="Sub-customer"
        width="110"
      />
      <el-table-column
        prop="palletSize"
        align="center"
        label="Plt Size"
        width="100"
      />
      <el-table-column
        prop="actualPlts"
        align="center"
        label="Org Plts"
        width="100"
      />
      <el-table-column
        align="center"
        prop="pickingPlts"
        label="Processing Plts"
        width="90"
      />
      <el-table-column
        prop="availablePlts"
        align="center"
        label="Ava Plts"
        width="120"
      />
      <el-table-column
        align="center"
        label="Org Ctns In-plts"
        width="140"
      >
        <template slot-scope="scope">
          <font>{{ obj_sum(scope.row.inPalletCtnInventories, "originalQuantity").originalQuantity }}</font>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="Porcessing Ctns In-plts"
        width="135"
      >
        <template slot-scope="scope">
          <font>{{ obj_sum(scope.row.inPalletCtnInventories, "pickingCtns").pickingCtns }}</font>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="Ava Ctns In-plts"
        width="140"
      >
        <template slot-scope="scope">
          <font>{{ obj_sum(scope.row.inPalletCtnInventories, "residualQuantity").residualQuantity }}</font>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="Hold Ctns In-plts"
        width="140"
      >
        <template slot-scope="scope">
          <font>{{ obj_sum(scope.row.inPalletCtnInventories, "holdQuantity").holdQuantity }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="location"
        align="center"
        label="Location"
      />
      <el-table-column
        prop="operation"
        label="operation"
        align="center"
        width="110"
      >
        <template slot-scope="scope">
          <el-button @click="onPltHistoryClicked(scope.row.pltId)">History</el-button>
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
        fbaPltInventories: Array,
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
        fbaPltInventories: function(val, oldVal){
            this.localTableData = this.fbaPltInventories;
            this.totalEntries = this.localTableData.length;
        }
    },
    methods:{
      onSearchChanged(search) {
        this.currentPage = 1;
        this.localTableData = this.fbaPltInventories.filter(data => {
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
      onCtnHistoryClicked(id) {
        this.$emit('onCtnHistoryClicked', id);
      },
      onPltHistoryClicked(id) {
        this.$emit('onPltHistoryClicked', id);
      },
      obj_sum(arr, ...param) {
        var temp = {};
        arr.forEach(function(item, index) {
            for(var k in item) {
                if(param.indexOf(k) >= 0) {
                    if((typeof item[k]) == 'string'){
                        item[k] = item[k]*1
                    }
                    if(temp[k]) {
                        temp[k] += item[k];
                    } else {
                        temp[k] = item[k];
                    }
                }
            }
        });
        return temp;
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
