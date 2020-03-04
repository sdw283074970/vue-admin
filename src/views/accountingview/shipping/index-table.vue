<template>
  <div>
    <div class="input-bar">
      <el-button type="primary" icon="el-icon-plus" @click="createHandler">New SO</el-button>
      <el-button type="primary" icon="el-icon-document" @click="filterVisible=true">SKU Filter</el-button>
      <el-button :loading="localLoading" icon="el-icon-refresh" type="warning" @click="clearFilter">Reset All</el-button>
      <el-input
        v-model="search"
        style="width:250px"
        size="large"
        :disabled="loading"
        placeholder="Search..."
      />
    </div>
    <div class="input-bar">
      <generic-order-multiple-filters :status-filters="statusFilters" :sort-by-options="sortByOptions" :customer-code-filters="customerCodeFilters" @onFilterFinish="onFilterFinish" />
    </div>
    <el-table
      ref="table"
      v-loading="loading"
      :data="filteredData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      stripe
      border
      fit=""
      :height="tableHeight"
      style="width: 100%"
      @filter-change="onFilterChange"
    >
      <el-table-column type="expand" fixed>
        <template slot-scope="props">
          <el-form label-position="left" inline class="gb-table-expand">
            <el-form-item label="Order #">
              <span>{{ props.row.shipOrderNumber }}</span>
            </el-form-item>
            <el-form-item label="Order Type">
              <span>{{ props.row.orderType }}</span>
            </el-form-item>
            <el-form-item label="Pick Reference">
              <span>{{ props.row.pickReference }}</span>
            </el-form-item>
            <el-form-item label="BOL #">
              <span>{{ props.row.bolNumber }}</span>
            </el-form-item>
            <el-form-item label="Pick #">
              <span>{{ props.row.pickNumber }}</span>
            </el-form-item>
            <el-form-item label="PO #">
              <span>{{ props.row.purchaseOrderNumber }}</span>
            </el-form-item>
            <el-form-item label="Carrier">
              <span>{{ props.row.carrier }}</span>
            </el-form-item>
            <el-form-item label="Push Date">
              <span>{{ transferDate(props.row.placeTime) }}</span>
            </el-form-item>
            <el-form-item label="Start Time">
              <span>{{ transferDate(props.row.startedTime) }}</span>
            </el-form-item>
            <el-form-item label="Ready Time">
              <span>{{ transferDate(props.row.readyTime) }}</span>
            </el-form-item>
            <el-form-item label="Released Date">
              <span>{{ transferDate(props.row.releasedDate) }}</span>
            </el-form-item>
            <el-form-item label="Shipped Date">
              <span>{{ transferDate(props.row.shipDate) }}</span>
            </el-form-item>
            <el-form-item label="Instruction">
              <span>{{ props.row.instruction }}</span>
            </el-form-item>
            <el-form-item label="Created By">
              <span>{{ props.row.createBy }}</span>
            </el-form-item>
            <el-form-item label="Closed By">
              <span>{{ props.row.confirmedBy }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        fixed=""
        prop="id"
        label="Id"
        width="80"
      />
      <el-table-column
        fixed
        prop="status"
        label="Status"
        align="center"
        width="110"
      >
        <template slot-scope="scope">
          <font :color="changeStatusColor(scope.row.status)">{{ scope.row.status }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="shipOrderNumber"
        label="Order #"
        fixed
        sortable
        width="200"
      />
      <el-table-column
        prop="batchNumber"
        label="Batch #"
        sortable
        width="100"
      />
      <el-table-column
        prop="customerCode"
        label="Code"
        align="center"
        :column-key="'code'"
        :filters="customerCodeFilters"
        width="100"
      />
      <el-table-column
        prop="subCustomer"
        align="center"
        label="Sub-code"
        width="120"
      />
      <el-table-column
        prop="destination"
        label="Dest"
        sortable
        width="120"
      />
      <el-table-column
        prop="totalCtns"
        label="Total Ctns"
        align="center"
        width="100"
      />
      <el-table-column
        prop="totalPlts"
        label="Total Plts"
        align="center"
        width="100"
      />
      <el-table-column
        label="Released Date"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          <font>{{ transferDate(scope.row.releasedDate) }}</font>
        </template>
      </el-table-column>
      <el-table-column
        label="POD"
        width="60"
        align="center"
      >
        <template slot-scope="scope">
          <font>{{ scope.row.podStatus===false?'N':'Y' }}</font>
        </template>
      </el-table-column>
      <el-table-column
        label="Amount"
        align="center"
        width="110"
      >
        <template slot-scope="scope">
          <font>{{ '$ ' + scope.row.totalAmount.toFixed(2) }}</font>
        </template>
      </el-table-column>
      <el-table-column
        label="Cost"
        align="center"
        width="110"
      >
        <template slot-scope="scope">
          <font>{{ '$ ' + scope.row.totalCost.toFixed(2) }}</font>
        </template>
      </el-table-column>
      <el-table-column
        label="Amount"
        align="center"
        width="110"
      >
        <template slot-scope="scope">
          <font>{{ '$ ' + (scope.row.totalAmount - scope.row.totalCost).toFixed(2) }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="invoiceStatus"
        align="center"
        label="Invoice Status"
        width="80"
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
        width="110"
        label="operation"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-dropdown>
            <span class="el-dropdown-link">
              Operations<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="onEfilesClicked(scope.row.shipOrderNumber)">eFiles</el-dropdown-item>
              <el-dropdown-item @click.native="editHandler(scope.row.id)">Edit</el-dropdown-item>
              <el-dropdown-item @click.native="woHandler(scope.row.id)">Details</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
      <shipping-index-edit-form
        :form-data="formData"
        :is-edit="isEdit"
        :destination-options="destinationOptions"
        :customer-code-options="customerCodeOptions"
        @onCreateConfirmedClicked="onCreateConfirmedClicked"
        @onEditConfirmedClicked="onEditConfirmedClicked"
        @onCancelClicked="onCancelClicked"
      />
    </el-dialog>
  </div>
</template>
<script>
/* eslint-disable vue/require-default-prop */
import { getShipOrderInfo, createNewShipOrder, updateShipOrderInfo } from '@/api/shipping'

export default {
  components: {
    'generic-order-multiple-filters': () => import('@/views/shareview/generic/generic-order-multiple-filters'),
    'generic-order-filter': () => import('@/views/shareview/generic/generic-order-filter'),
    'shipping-index-edit-form': () => import('@/views/officeview/shipping/index-edit-form')
  },
  props: {
    tableData: Array,
    loading: Boolean,
    customerCodeFilters: Array,
    destinationOptions: Array,
    customerCodeOptions: Array
  },
  data() {
    return {
      tableHeight: window.innerHeight * 0.75,
      currentPage: 1,
      pageSize: 20,
      search: '',
      filteredData: [],
      customerCodeFilter: [],
      localLoading: false,
      filterVisible: false,
      editVisible: false,
      isEdit: false,
      formData: {
        id: 0,
        status: '',
        shipOrderNumber: '',
        customerCode: '',
        ets: '',
        orderType: 'Standard',
        invoiceStatus: 'Await',
        destination: '',
        pickReference: '',
        carrier: '',
        batchNumber: '',
        podStatus: false,
        etsTimeRange: '',
        bolNumber: '',
        pickNumber: '',
        subCustomer: '',
        purchaseOrderNumber: '',
        instruction: ''
      },
      statusFilters: [
        { value: 'New Created', text: 'New Created' },
        { value: 'Picking', text: 'Picking' },
        { value: 'Draft', text: 'Draft' },
        { value: 'New Order', text: 'New Order' },
        { value: 'Updated', text: 'Updated' },
        { value: 'Returned', text: 'Returned' },
        { value: 'Processing', text: 'Processing' },
        { value: 'Ready', text: 'Ready' },
        { value: 'Released', text: 'Released' },
        { value: 'Shipped', text: 'Shipped' }
      ],
      sortByOptions: [
        { text: 'Id', value: 'Id' },
        { text: 'Status', value: 'Status' },
        { text: 'Ship Order #', value: 'ShipOrderNumber' },
        { text: 'Customer Code', value: 'CustomerCode' },
        { text: 'Container Size', value: 'ContainerSize' },
        { text: 'Batch #', value: 'BatchNumber' },
        { text: 'Subcustomer Code', value: 'SubCustomer' },
        { text: 'Dest', value: 'Destination' },
        { text: 'ETS', value: 'ETS' },
        { text: 'Total Ctns', value: 'TotalCtns' },
        { text: 'Total Plts', value: 'TotalPlts' },
        { text: 'POD', value: 'PODStatus' },
        { text: '$ Amount', value: 'TotalAmount' },
        { text: '$ Cost', value: 'TotalCost' },
        { text: '$ Net', value: 'Net' },
        { text: 'Invoice Status', value: 'InvoiceStatus' },
        { text: 'Close Date', value: 'CloseDate' }
      ]
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
  methods: {
    transferDate: function(date) {
      return date === undefined ? '' : (date.substring(0, 4) === '1900' ? '-' : date.substring(0, 10))
    },
    clearFilter() {
      this.$refs.table.clearFilter()
      this.$emit('onRefreshClicked')
    },
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    editHandler: function(id) {
      this.editVisible = true
      this.editVisible = true
      this.isEdit = true
      getShipOrderInfo(id).then(body => {
        this.formData = body.data
      })
    },
    createHandler: function() {
      this.editVisible = true
      this.isEdit = false
      this.formData = {
        id: 0,
        status: 'New Created',
        shipOrderNumber: '',
        customerCode: '',
        ets: '',
        orderType: 'Standard',
        invoiceStatus: 'Await',
        destination: '',
        pickReference: '',
        carrier: '',
        batchNumber: '',
        podStatus: false,
        etsTimeRange: '',
        bolNumber: '',
        pickNumber: '',
        subCustomer: '',
        purchaseOrderNumber: '',
        instruction: ''
      }
    },
    woHandler: function(id) {
      this.$router.push({ path: '/accounting-shipping/shipping-wo/' + id })
    },
    changeStatusColor: function(status) {
      if (status === 'New Created' || status === 'Draft') { return 'gray' } else if (status === 'Picking' || status === 'Processing' || status === 'Pending') { return 'red' } else if (status === 'New Order' || status === 'Returned' || status === 'New PO' || status === 'Updated') { return 'orange' } else if (status === 'Ready') { return 'green' } else if (status === 'Released') { return 'brown' } else if (status === 'Shipped') { return 'blue' } else { return 'black' }
    },
    onEfilesClicked(reference) {
      this.$emit('onEfilesClicked', reference)
    },
    onFilterChange(filters) {
      this.filteredData = this.filteredData.filter((row) => {
        return row.customerCode === filters.code[0]
      })
    },
    onFilterConfirmed(filter) {
      this.filterVisible = false
      this.$emit('onFilterConfirmed', filter)
    },
    onCreateConfirmedClicked() {
      createNewShipOrder(this.formData).then(body => {
        this.$message({
          message: 'Success!',
          type: 'success'
        })
        this.editVisible = false
        this.filteredData.splice(0, 0, body.data)
      })
    },
    onEditConfirmedClicked(id) {
      updateShipOrderInfo(id, this.formData).then(body => {
        this.$message({
          message: 'Success!',
          type: 'success'
        })
        this.editVisible = false
        const index = this.filteredData.map(o => o.id).indexOf(body.data.id)
        this.filteredData.splice(index, 1, body.data)
      })
    },
    onCancelClicked() {
      this.editVisible = false
    },
    onFilterFinish(filter) {
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
