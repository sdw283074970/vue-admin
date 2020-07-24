
<template>
  <div>
    <h2>TRANSIT REMINDER</h2>
    <el-table
      ref="table"
      v-loading="loading"
      :data="filteredData"
      stripe
      border
      fit=""
    >
      <el-table-column
        sortable
        prop="id"
        label="Id"
        width="60"
      />
      <el-table-column
        prop="status"
        label="Status"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          <font :color="changeStatusColor(scope.row.status)">{{ scope.row.status }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="container"
        label="Container #"
        sortable
        width="170"
      />
      <el-table-column
        prop="customerCode"
        label="Customer Code"
        align="center"
        width="130"
      />
      <el-table-column
        prop="storageType"
        label="Storage Type"
        align="center"
        sortable
        width="160"
      />
      <el-table-column
        prop="inboundDate"
        label="Inbound Date"
        sortable
        align="center"
        width="140"
      >
        <template slot-scope="scope">
          <font>{{ transferDate(scope.row.inboundDate) }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="avaCtns"
        label="In-stock Ctns"
        align="center"
        width="120"
      />
      <el-table-column
        prop="avaPlts"
        label="In-stock Plts"
        align="center"
        width="120"
      />
    </el-table>
  </div>
</template>

<script>
import { getTransitShipmentReminder } from '@/api/dashboard'
export default {
  name: 'DashboardAdmin',
  data() {
    return {
      loading: true,
      filteredData: []
    }
  },
  mounted() {
    getTransitShipmentReminder().then(body => {
      this.filteredData = body.data
      this.loading = false
    })
  },
  methods: {
    changeStatusColor: function(status) {
      if (status === 'New Created' || status === 'Draft') { return 'gray' } else if (status === 'Picking' || status === 'Processing' || status === 'Pending' || status === 'Updated') { return 'red' } else if (status === 'Incoming' || status === 'Returned') { return 'orange' } else if (status === 'Allocated') { return 'brown' } else if (status === 'Received') { return 'green' } else if (status === 'Registered') { return 'purple' } else if (status === 'Arrived') { return 'darkcyan' } else { return 'blue' }
    },
    transferDate: function(date) {
      return date === undefined ? '' : (date.substring(0, 4) === '1900' ? '-' : date.substring(0, 10))
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
