<template>
  <div class="gb-maincontainer">
    <h1>System User Manager</h1>
    <div class="input-bar">
      <el-button type="primary" icon="el-icon-plus" @click="onRegisterClicked">Register New User</el-button>
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
      height="715"
      style="width: 100%"
      @filter-change="filterChange"
    >
      <el-table-column
        prop="userName"
        label="User Name"
        width="240"
      />
      <el-table-column
        prop="email"
        label="E-mail"
        width="240"
      />
      <el-table-column
        label="Roles"
        align="center"
        width="200"
      >
        <template slot-scope="scope">
          <font>{{ scope.row.roles }}</font>
        </template>
      </el-table-column>
      <el-table-column
        label="Connected Customer"
        align="center"
        width="200"
      >
        <template slot-scope="scope">
          <font>{{ scope.row.customerCodes }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="latestLogin"
        label="Latest Login"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          <font>{{ transferDate(scope.row.latestLogin) }}</font>
        </template>
      </el-table-column>
      <el-table-column
        label="operation"
      >
        <template>
          <!-- <template slot-scope="scope"> -->
          <el-button disabled>Reset Password</el-button>
          <el-button disabled>Change Authority</el-button>
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

    <el-dialog title="Register" :visible.sync="registerVisible" top="5vh" width="500px">
      <div>
        <el-form ref="registerForm" :model="form" :rules="rules">
          <el-form-item label="Email" :label-width="formLabelWidth" prop="name">
            <el-input v-model="form.name" autocomplete="on" :disabled="isEdit" />
          </el-form-item>
          <el-form-item label="Warning Level(Ctns)" :label-width="formLabelWidth" prop="warningQuantityLevel">
            <el-input v-model="form.warningQuantityLevel" type="number" autocomplete="on" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer" style="margin-bottom:30px;text-align:center">
        <el-button v-if="isEdit" type="primary" @click="onUpdateClicked">Update</el-button>
        <el-button v-if="!isEdit" type="primary" @click="onCreateClicked">Create</el-button>
        <el-button @click="editVisible = false">Cancel</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import { getCustomerDB, createCustomer, updateCustomer } from '@/api/customer'
import { getAllUsers } from '@/api/user'

export default {
    data() {
        return {
            tableData: [],
            filteredData: [],
            totalEntries: 0,
            currentPage: 1,
            pageSize: 20,
            search: '',
            loading: true,
            registerVisible : false,
            formLabelWidth : '200px',
            customerCodeFilter : [],
            isEdit: false,
            form: {
              id : 0,
              name: '',
              departmentCode: '',
              customerCode: '',
              warningQuantityLevel: 0,
              firstAddressLine: '',
              secondAddressLine: '',
              telNumber: '',
              emailAddress: '',
              contactPerson: ''
            },
            rules: {
              name: [
                { required: true, message: 'Please input customer name', trigger: 'change' }
              ],
              customerCode: [
                { required: true, message: 'Please input customer code', trigger: 'change' }
              ],
              warningQuantityLevel: [
                { required: true, message: 'Please input the warning level', trigger: 'change' }
              ]
            }
        };
    },
    watch:{
      search: function(val, oldVal){
        this.filteredData = this.tableData.filter(data => {
            return Object.keys(data).some(key => {
              return String(data[key]).toLowerCase().indexOf(this.search.toLowerCase()) > -1
          })
        })
        this.totalEntries = this.filteredData.length;
      }
    },
    methods:{
      transferDate: function(date) {
        return date === undefined ? '' : (date.substring(0, 4) === '1900' ? '-' : date.substring(0, 10))
      },
      filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
      },
      filterChange(filters){
      	console.log(filters);
      },
      clearFilter() {
        this.$refs.customerTable.clearFilter();
      },
      handleSizeChange(val) {
        this.pageSize = val;
      },
      handleCurrentChange(val) {
        this.currentPage = val;
      },
      editHandler: function(id, index) {
        if (this.$refs.customerForm != undefined)
        {
          this.$refs.customerForm.resetFields()
        }
        this.editVisible = true
        this.isEdit = true
        this.tableData.find((i) => {
          if (i.id === id)
          {
            this.form = i;
            return;
          }
        });        
      },
      onUpdateClicked() {
        this.$refs['customerForm'].validate((valid) => {
            if (valid) {
                updateCustomer(this.form).then(() => {
                  this.editVisible = false
                  this.reloadCustomers()
                })
            } else {
                console.log('error submit!!');
                return false;
            }
        });
      },
      onCreateClicked() {
        this.$refs['customerForm'].validate((valid) => {
            if (valid) {
                createCustomer(this.form).then(() => {
                  this.editVisible = false
                  this.reloadCustomers()
                })
            } else {
                console.log('error submit!!');
                return false;
            }
        });
      },
      onRegisterClicked() {
        this.registerVisible = true;
      },
      reloadUsers() {
        getAllUsers().then(
            body => {
                this.tableData = body.data
                this.filteredData = body.data
                this.totalEntries = body.data.length
                this.loading = false
                this.$message({
                  message: 'Success',
                  type: 'success'
                })
            }
        )
      }
    },
    mounted() {
        getAllUsers().then(
            body => {
                this.tableData = body.data
                this.filteredData = body.data
                this.totalEntries = body.data.length
                this.loading = false
            }
        )
    }
}
</script>

<style lang="scss" scoped>
    .input-bar{
      text-align: right
    }
</style>
