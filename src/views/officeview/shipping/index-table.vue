<template>
  <div>
    <div class="input-bar">
      <el-button type="primary" icon="el-icon-plus" @click="createHandler">New SO</el-button>
      <el-button @click="clearFilter">Clear All Filters</el-button>
      <el-input
        v-model="search"
        style="width:250px"
        size="large"
        placeholder="Search..."
      />
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
      @filter-change="filterChange"
    >
      <el-table-column type="expand">
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
              <span>{{ props.row.placeTime.substring(0, 4)==1900?'-':props.row.placeTime.substring(0, 10) }}</span>
            </el-form-item>
            <el-form-item label="Start Time">
              <span>{{ props.row.startedTime.substring(0, 4)==1900?'-':props.row.startedTime.substring(0, 10) }}</span>
            </el-form-item>
            <el-form-item label="Ready Time">
              <span>{{ props.row.readyTime.substring(0, 4)==1900?'-':props.row.readyTime.substring(0, 10) }}</span>
            </el-form-item>
            <el-form-item label="Released Date">
              <span>{{ props.row.releasedDate.substring(0, 4)==1900?'-':props.row.releasedDate.substring(0, 10) }}</span>
            </el-form-item>
            <el-form-item label="Shipped Date">
              <span>{{ props.row.shipDate.substring(0, 4)==1900?'-':props.row.shipDate.substring(0, 10) }}</span>
            </el-form-item>
            <el-form-item label="Total Amount">
              <span>${{ props.row.totalAmount }}</span>
            </el-form-item>
            <el-form-item label="Toal Cost">
              <span>${{ props.row.totalCost }}</span>
            </el-form-item>
            <el-form-item label="Net">
              <span>${{ props.row.totalAmount-props.row.totalCost }}</span>
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
        sortable
        fixed=""
        prop="id"
        label="Id"
        min-width="10%"
      />
      <el-table-column
        sortable
        fixed
        prop="status"
        label="Status"
        min-width="20%"
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
        min-width="40%"
      />
      <el-table-column
        prop="batchNumber"
        label="Batch #"
        sortable
        min-width="20%"
      />
      <el-table-column
        prop="customerCode"
        label="Code"
        sortable
        :column-key="'code'"
        :filters="customerCodeFilter"
        min-width="20%"
      />
      <el-table-column
        prop="subCustomer"
        label="Sub-code"
        sortable
        min-width="20%"
      />
      <el-table-column
        prop="destination"
        label="Dest"
        sortable
        min-width="20%"
      />
      <el-table-column
        prop="ets"
        label="ETS"
        sortable
        min-width="20%"
      >
        <template slot-scope="scope">
          <font>{{ scope.row.ets.substring(0, 10) }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="totalCtns"
        label="Total Ctns"
        min-width="20%"
      />
      <el-table-column
        prop="totalPlts"
        label="Total Plts"
        min-width="20%"
      />
      <el-table-column
        prop="operation"
        label="operation"
      >
        <template slot-scope="scope">
          <el-button @click="onEfilesClicked(scope.row.shipOrderNumber)">eFiles</el-button>
          <el-button @click="editHandler(scope.row.id, scope.$index)">Fee</el-button>
          <el-button @click="editHandler(scope.row.id)">Edit</el-button>
          <el-button @click="woHandler(scope.row.id)">WO</el-button>
          <el-button type="danger" plain @click="editHandler(scope.row.id, scope.$index)">Delete</el-button>
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
    props:{
        filteredData: Array,
        loading: Boolean,
        totalEntries: Intl
    },
    data() {
        return {
            tableHeight: window.innerHeight * 0.75,
            currentPage: 1,
            pageSize: 20,
            search: '',
            customerCodeFilter : []
        };
    },
    watch:{
      search: function(val, oldVal){
        this.$emit('onSearchChanged', val);
      }
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
      editHandler: function(id) {
        this.$emit('onEditClicked', id);
      },
      createHandler: function(){
        this.$emit('onCreateClicked');
      },
      woHandler: function(id){
        this.$router.push({path: '/shipping/shipping-wo/' + id});
      },
      changeStatusColor: function(status) {
        if (status == 'New Created' || status == 'Draft')
            return 'gray';
        else if (status == 'Picking' || status == 'Processing' || status == 'Pending')
            return 'red';
        else if (status == 'New Order' || status == 'Returned' || status == 'New PO' || status == 'Updated')
            return 'orange';
        else if (status == 'Ready')
            return 'green';
        else if (status == 'Released')
            return 'brown';
        else if (status == 'Shipped')
            return 'blue';
        else
            return 'black';
      },
      onEfilesClicked(reference) {
        this.$emit('onEfilesClicked', reference)
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
