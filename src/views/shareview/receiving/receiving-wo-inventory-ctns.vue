<template>
  <div>
    <el-table
      v-if="isVisible"
      ref="inventory-ctns"
      :data="ctnInventoryData"
      stripe
      border
      :height="tableHight"
      style="width: 100%"
    >
      <el-table-column
        sortable
        prop="id"
        label="Ctn Id"
        width="100"
      />
      <el-table-column
        prop="shipmentId"
        sortable=""
        label="Shipment Id/SKU"
        min-width="60%"
      />
      <el-table-column
        prop="amzRefId"
        sortable=""
        label="Amz Ref Id"
        min-width="60%"
      />
      <el-table-column
        prop="warehouseCode"
        label="Whse Code"
        min-width="30%"
      />
      <el-table-column
        prop="actualQuantity"
        label="Org Ctns"
        min-width="30%"
      />
      <el-table-column
        prop="availableCtns"
        label="Ava Ctns"
        min-width="30%"
      />
      <el-table-column
        prop="pickingCtns"
        label="Picking Ctns"
        min-width="30%"
      />
      <el-table-column
        prop="shippedCtns"
        label="Shipped Ctns"
        min-width="30%"
      />
      <el-table-column
        prop="location"
        label="Location"
        min-width="30%"
      />
      <el-table-column
        label="Operation"
        align="center"
        min-width="30%"
      >
        <template slot-scope="scope">
          <el-button @click="pickHandler(scope.row.id)">History</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
/* eslint-disable */

export default {
  props: {
    isVisible: false,
    ctnInventoryData: Array
  },
  data(){
    return {
      tableHight: window.innerHeight * 0.6
    }
  },
  methods:{

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
