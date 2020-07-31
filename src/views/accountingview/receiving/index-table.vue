<template>
  <div>
    <div class="input-bar">
      <generic-order-multiple-filters :status-filters="statusFilters" :sort-by-options="sortByOptions" :customer-code-filters="customerCodeFilters" @onFilterFinish="onFilterFinish" />
    </div>
    <div class="input-bar">
      <!-- <el-button type="primary" icon="el-icon-plus" @click="onCreateClicked">New Inbound Order</el-button> -->
      <el-button type="primary" icon="el-icon-document" @click="filterVisible=true">SKU Filter</el-button>
      <el-button :loading="localLoading" icon="el-icon-refresh" type="warning" @click="clearFilter">Reset All</el-button>
      <el-input
        v-model="search"
        style="width:250px"
        size="small"
        placeholder="Search in results..."
        :disabled="loading"
      />
    </div>
    <el-table
      ref="table"
      v-loading="loading"
      :data="filteredData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      stripe
      border
      style="width: 100%"
      @filter-change="onFilterChange"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="gb-table-expand">
            <el-form-item label="Container #">
              <span>{{ props.row.container }}</span>
            </el-form-item>
            <el-form-item label="Grand #">
              <span>{{ props.row.grandNumber }}</span>
            </el-form-item>
            <el-form-item label="Unloading Type">
              <span>{{ props.row.unloadingType }}</span>
            </el-form-item>
            <el-form-item label="Storage Type">
              <span>{{ props.row.storageType }}</span>
            </el-form-item>
            <el-form-item label="Palletizing">
              <span>{{ props.row.palletizing }}</span>
            </el-form-item>
            <el-form-item label="Carrier">
              <span>{{ props.row.carrier }}</span>
            </el-form-item>
            <el-form-item label="Dock #">
              <span>{{ props.row.dockNumber }}</span>
            </el-form-item>
            <el-form-item label="Container Size">
              <span>{{ props.row.containerSize }}</span>
            </el-form-item>
            <el-form-item label="Push Date">
              <span>{{ props.row.pushTime.substring(0, 4)==1900?'-':props.row.pushTime.substring(0, 10) }}</span>
            </el-form-item>
            <el-form-item label="Start Time">
              <span>{{ props.row.unloadStartTime.substring(0, 4)==1900?'-':props.row.unloadStartTime.substring(0, 10) }}</span>
            </el-form-item>
            <el-form-item label="Finish Time">
              <span>{{ props.row.unloadFinishTime.substring(0, 4)==1900?'-':props.row.unloadFinishTime.substring(0, 10) }}</span>
            </el-form-item>
            <el-form-item label="Out Time">
              <span>{{ props.row.outTime.substring(0, 4)==1900?'-':props.row.outTime.substring(0, 10) }}</span>
            </el-form-item>
            <el-form-item label="Instruction">
              <span>{{ props.row.instruction }}</span>
            </el-form-item>
            <el-form-item label="Created By">
              <span>{{ props.row.createdBy }}</span>
            </el-form-item>
            <el-form-item label="Closed By">
              <span>{{ props.row.confirmedBy }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        prop="id"
        label="Id"
        width="60"
      />
      <el-table-column
        prop="status"
        :column-key="'status'"
        label="Status"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <font :color="changeStatusColor(scope.row.status)">{{ scope.row.status }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="container"
        label="Container #"
        width="160"
      />
      <el-table-column
        prop="customerCode"
        label="Customer Code"
        align="center"
        width="80"
      />
      <el-table-column
        prop="subCustomer"
        label="Sub-code"
        align="center"
        width="100"
      />
      <el-table-column
        prop="containerSize"
        label="Container Size"
        align="center"
        width="80"
      />
      <el-table-column
        prop="inboundType"
        label="Inbound Type"
        align="center"
        width="70"
      />
      <el-table-column
        prop="carrier"
        align="center"
        label="Carrier Info"
        width="120"
      />
      <el-table-column
        prop="inboundDate"
        label="Inbound Date(ATA)"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <font>{{ transferDate(scope.row.inboundDate) }}</font>
        </template>
      </el-table-column>
      <el-table-column
        label="Org Ctns"
        prop="totalCtns"
        align="center"
        width="90"
      />
      <el-table-column
        label="Actual Ctns"
        prop="actualCtns"
        align="center"
        width="90"
      />
      <el-table-column
        label="Org Plts"
        prop="originalPlts"
        align="center"
        width="90"
      />
      <el-table-column
        label="Actual Plts"
        prop="actualPlts"
        align="center"
        width="90"
      />
      <el-table-column
        prop="skuNumber"
        label="SKU #"
        align="center"
        width="80"
      />
      <el-table-column
        label="Amount"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <font>{{ '$ ' + scope.row.totalAmount.toFixed(2) }}</font>
        </template>
      </el-table-column>
      <el-table-column
        label="Cost"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <font>{{ '$ ' + scope.row.totalCost.toFixed(2) }}</font>
        </template>
      </el-table-column>
      <el-table-column
        label="Net"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <font>{{ '$ ' + (scope.row.totalAmount - scope.row.totalCost).toFixed(2) }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="invoiceStatus"
        align="center"
        label="Invoice Status"
        width="70"
      />
      <el-table-column
        prop="closeDate"
        label="Close Date"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <font>{{ transferDate(scope.row.closeDate) }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="operation"
        label="Operation"
      >
        <template slot-scope="scope">
          <el-dropdown>
            <span class="el-dropdown-link">
              More<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="onEfilesClicked(scope.row.container)">eFiles</el-dropdown-item>
              <el-dropdown-item @click.native="editHandler(scope.row.id, scope.$index)">Edit</el-dropdown-item>
              <el-dropdown-item @click.native="woHandler(scope.row.id)">Details</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-if="!loading"
      style="margin-top:10px"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="20"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalEntries"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog
      title="Manage Efiles"
      :visible.sync="filterVisible"
      width="300px"
      top="5vh"
      :lock-scroll="false"
    >
      <generic-order-filter @onFilterConfirmed="onFilterConfirmed" />
    </el-dialog>
    <el-dialog
      title="Create/Edit"
      :visible.sync="editVisible"
      width="750px"
      top="5vh"
      :lock-scroll="false"
    >
      <receiving-index-edit-form
        :form-data="formData"
        :is-edit="isEdit"
        :destination-options="destinationOptions"
        :customer-code-options="customerCodeOptions"
        :local-loading="localLoading"
        @onCreateConfirmedClicked="onCreateConfirmedClicked"
        @onEditConfirmedClicked="onEditConfirmedClicked"
        @onCancelClicked="onCancelClicked"
      />
    </el-dialog>
  </div>
</template>
<script>
/* eslint-disable vue/require-default-prop */
import { createNewrReceivingOrder, getReceivingOrderInfo, updateReceivingOrderInfo } from '@/api/receiving'
import { inboundOrderStatus, inboundOrderSortOption } from '@/scripts/dropdown'
import { eventBus } from '@/main'

export default {
  components: {
    'generic-order-multiple-filters': () => import('@/views/shareview/generic/generic-order-multiple-filters'),
    'generic-order-filter': () => import('@/views/shareview/generic/generic-order-filter'),
    'receiving-index-edit-form': () => import('@/views/officeview/receiving/index-edit-form')
  },
  props: {
    destinationOptions: Array,
    customerCodeOptions: Array,
    tableData: Array,
    loading: Boolean,
    customerCodeFilters: Array
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 20,
      search: '',
      customerCodeFilter: [],
      filteredData: [],
      localLoading: false,
      editVisible: false,
      filterVisible: false,
      isEdit: false,
      orderType: 'MasterOrder',
      formData: {
        id: 0,
        status: '',
        container: '',
        customerCode: '',
        eta: '',
        inboundType: '',
        unloadingType: '',
        storageType: '',
        palletizing: '',
        invoiceStatus: 'Await',
        subCustomer: '',
        carrier: '',
        originalPlts: 0,
        containerSize: '',
        vessel: '',
        voy: '',
        etaPort: '',
        placeOfReceipt: '',
        portOfLoading: '',
        portOfDischarge: '',
        placeOfDelivery: '',
        sealNumber: '',
        instruction: ''
      },
      statusFilters: inboundOrderStatus,
      sortByOptions: inboundOrderSortOption
    }
  },
  computed: {
    totalEntries() {
      return this.filteredData.length
    }
  },
  watch: {
    tableData: function(val, oldVal) {
      this.filteredData = val
    },
    search: function(val, oldVal) {
      this.filteredData = this.tableData.filter(data => {
        return Object.keys(data).some(key => {
          return String(data[key]).toLowerCase().indexOf(val.toLowerCase()) > -1
        })
      })
    }
  },
  mounted() {

  },
  created() {
    eventBus.$on('cleanFilter', () => {
      this.search = ''
    })
  },
  methods: {
    transferDate: function(date) {
      return date === undefined ? '' : (date.substring(0, 4) === '1900' ? '-' : date.substring(0, 10))
    },
    clearFilter() {
      this.$refs.table.clearFilter()
      eventBus.$emit('onClearFilterClicked')
      this.search = ''
      this.$emit('onRefreshClicked')
      // this.localLoading = true;
      // this.filteredData = this.tableData;
      // this.localLoading = false;
    },
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    editHandler: function(id) {
      this.editVisible = true
      this.isEdit = true
      getReceivingOrderInfo(id).then(body => {
        this.formData = body.data
      })
    },
    woHandler: function(id) {
      this.$router.push({ path: '/accounting-receiving/receiving-wo/' + id })
    },
    changeStatusColor: function(status) {
      if (status === 'New Created' || status === 'Draft') { return 'gray' } else if (status === 'Picking' || status === 'Processing' || status === 'Pending' || status === 'Updated') { return 'red' } else if (status === 'Incoming' || status === 'Returned') { return 'orange' } else if (status === 'Allocated') { return 'brown' } else if (status === 'Received') { return 'green' } else if (status === 'Registered') { return 'purple' } else if (status === 'Arrived') { return 'darkcyan' } else { return 'blue' }
    },
    onEfilesClicked(reference) {
      this.$emit('onEfilesClicked', reference)
    },
    onFilterChange(filters) {
      this.filteredData = this.tableData.filter((row) => {
        return row.customerCode === filters.code[0]
      })

      // var arr = [];
      // this.filteredData.filter(row => {
      //   if (row.customerCode == filters.code[0])
      //   {
      //     arr.push(row);
      //   }
      // })
      // this.filteredData = arr;

      // this.filteredData = this.tableData.filter((row) => {
      //   return row.status = filters.status[0]
      // })
    },
    onFilterConfirmed(filter) {
      this.filterVisible = false
      this.$emit('onFilterConfirmed', filter)
    },

    onCreateConfirmedClicked() {
      createNewrReceivingOrder(this.formData).then(body => {
        this.$message({
          message: 'Success!',
          type: 'success'
        })
        this.editVisible = false
        this.localLoading = false
        this.filteredData.splice(0, 0, body.data)
      })
    },
    onEditConfirmedClicked(id) {
      updateReceivingOrderInfo(id, this.formData).then(body => {
        this.$message({
          message: 'Success!',
          type: 'success'
        })
        this.localLoading = false
        this.editVisible = false
        const index = this.filteredData.map(o => o.id).indexOf(body.data.id)
        this.filteredData.splice(index, 1, body.data)
      })
    },
    onCancelClicked() {
      this.editVisible = false
    },
    onCreateClicked() {
      this.editVisible = true
      this.isEdit = false
      this.formData = {
        id: 0,
        status: '',
        container: '',
        customerCode: '',
        eta: '',
        originalPlts: 0,
        inboundType: '',
        unloadingType: '',
        storageType: '',
        palletizing: '',
        invoiceStatus: 'Await',
        subCustomer: '',
        carrier: '',
        containerSize: '',
        vessel: '',
        voy: '',
        etaPort: '',
        placeOfReceipt: '',
        portOfLoading: '',
        portOfDischarge: '',
        placeOfDelivery: '',
        sealNumber: '',
        instruction: ''
      }
    },
    onFilterFinish(filter) {
      this.currentPage = 1
      this.$emit('onFilterFinish', filter)
    }
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
