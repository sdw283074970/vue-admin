<template>
  <div>
    <el-table
      v-if="isVisible"
      ref="allocating-ctns"
      :data="ctnData"
      stripe
      border
      height="500"
      style="width: 100%"
    >
      <el-table-column
        sortable
        prop="id"
        label="Ctn Id"
        width="100"
      />
      <el-table-column
        prop="container"
        label="Container #"
        sortable=""
        min-width="60%"
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
        align="center"
      />
      <el-table-column
        prop="actualQuantity"
        label="Ttl Ctns"
        min-width="20%"
        align="center"
      />
      <el-table-column
        prop="comsumedQuantity"
        label="TBA Ctns"
        min-width="25%"
        align="center"
      >
        <template
          slot-scope="scope"
        >
          <font>{{ scope.row.actualQuantity - scope.row.comsumedQuantity }}</font>
        </template>
      </el-table-column>
      <!-- <el-table-column
        type="selection"
        min-width="20%"
      /> -->
      <el-table-column
        label="Ctns/Location"
        align="center"
        min-width="40%"
      >
        <template slot-scope="scope">
          <el-input v-model="scope.row.ctnsPerLocation" style="width:100px" type="number" />
        </template>
      </el-table-column>
      <el-table-column
        label="Location"
        align="center"
        min-width="40%"
      >
        <template slot-scope="scope">
          <el-input v-model="scope.row.tempLocation" style="width:100px" />
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
    ctnData: Array
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
