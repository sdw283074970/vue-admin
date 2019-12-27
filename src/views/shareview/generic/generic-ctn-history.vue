<template>
  <div>
    <h3>{{ 'Contianer: ' + historySum.container }}</h3>
    <h3>{{ 'Shipmen Id/SKU: ' + historySum.shipmentId }}</h3>
    <h3>{{ 'Amz Ref. Id: ' + historySum.amzRefId }}</h3>
    <h3>{{ 'Customer Code: ' + historySum.customerCode }}</h3>
    <h3>{{ 'Warehouse Code: ' + historySum.warehouseCode }}</h3>
    <el-table
      ref="location-ctns"
      show-summary
      :data="ctnOutboundHistories"
      stripe
      border
      :max-height="tableHight"
      style="width: 100%"
    >
      <el-table-column
        prop="shipOrderId"
        label="Id"
        width="70"
      />
      <el-table-column
        prop="status"
        label="Order Status"
        width="120"
      />
      <el-table-column
        prop="placeTime"
        label="Push Date"
        width="120"
      >
        <template slot-scope="scope">
          <font>{{ transferDate(scope.row.placeTime) }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="shipOrderNumber"
        label="Outbound Order #"
      />
      <el-table-column
        prop="orderType"
        label="Outbound Type"
        width="130"
      />
      <el-table-column
        prop="quantity"
        label="Picked Ctns"
        width="120"
      />
      <el-table-column
        prop="location"
        label="Location"
        width="120"
      />
    </el-table>
  </div>
</template>
<script>
/* eslint-disable */

export default {
    props: {
        ctnOutboundHistories: Array,
        historySum: {}
    },
    data(){
        return {
            tableHight: window.innerHeight * 0.6,
            localTableData: []
        }
    },
    watch:{

    },
    methods:{
        transferDate: function(date) {
            return date === undefined ? '' : (date.substring(0, 4) === 1900 ? '-' : date.substring(0, 10))
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
