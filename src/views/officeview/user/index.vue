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
      style="width: 100%"
      @filter-change="filterChange"
    >
      <el-table-column
        prop="userName"
        label="User Name"
        width="240"
        sortable
      />
      <el-table-column
        prop="email"
        label="E-mail"
        sortable
        width="240"
      />
      <el-table-column
        prop="roles"
        label="Roles"
        align="center"
        sortable
        width="200"
      >
        <template slot-scope="scope">
          <font>{{ scope.row.roles }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="customerCodes"
        label="Connected Customer"
        align="center"
        sortable
        width="220"
      >
        <template slot-scope="scope">
          <font>{{ scope.row.customerCodes }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="latestLogin"
        label="Latest Login"
        align="center"
        sortable
        width="140"
      >
        <template slot-scope="scope">
          <font>{{ transferDate(scope.row.latestLogin) }}</font>
        </template>
      </el-table-column>
      <el-table-column
        label="operation"
      >
        <template slot-scope="scope">
          <!-- <template slot-scope="scope"> -->
          <el-button v-if="checkPermission(['admin'])" disabled>Reset Password</el-button>
          <el-button v-if="checkPermission(['admin'])" type="primary" @click="onChangeClicke(scope.row.id)">Change Authority</el-button>
          <el-button v-if="checkPermission(['admin'])" type="danger" @click="onDeleteClicked(scope.row.id)">Delete User</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="margin-top:10px"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalEntries"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-dialog title="Register" :visible.sync="registerVisible" top="5vh" width="500px">
      <div>
        <el-form ref="registerForm" :model="form" :rules="rules">
          <el-form-item label="Email" :label-width="formLabelWidth" prop="name">
            <el-input v-model="form.name" autocomplete="on" placeholder="Email Address" :disabled="isEdit" />
          </el-form-item>
          <el-form-item label="Role" :label-width="formLabelWidth" prop="role">
            <el-select v-model="form.role" placeholder="-- Select Role --">
              <el-option label="Administrator" value="Admin" />
              <el-option label="Customer" value="Client" />
              <el-option label="Trainee" value="T1" />
              <el-option label="Warehouse" value="T2" />
              <el-option label="Office" value="T3" />
              <el-option label="Sales" value="T4" />
              <el-option label="Accounting" value="T5" />
            </el-select>
          </el-form-item>
        </el-form>
        <div style="text-align:center">
          <p>Default password is "User123456*"</p>
        </div>
      </div>
      <div slot="footer" class="dialog-footer" style="margin-bottom:30px;text-align:center">
        <el-button v-if="!isEdit" type="primary" @click="onCreateClicked">Create</el-button>
        <el-button @click="editVisible = false">Cancel</el-button>
      </div>
    </el-dialog>

    <el-dialog title="Change Authority" :visible.sync="authVisible" top="5vh" width="500px">
      <div>
        <el-form ref="authority-form" :model="form" :rules="rules">
          <el-form-item label="Role" :label-width="formLabelWidth" prop="role">
            <el-select v-model="form.role" placeholder="-- Select Role --">
              <el-option label="Administrator" value="CanDeleteEverything" />
              <el-option label="Customer" value="CanViewAsClientOnly" />
              <el-option label="Trainee" value="CanOperateAsT1" />
              <el-option label="Warehouse" value="CanOperateAsT2" />
              <el-option label="Office" value="CanOperateAsT3" />
              <el-option label="Sales" value="CanOperateAsT4" />
              <el-option label="Accounting" value="CanOperateAsT5" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer" style="margin-bottom:30px;text-align:center">
        <el-button v-if="!isEdit" type="primary" @click="onChangeConfirmed">Change</el-button>
        <el-button @click="editVisible = false">Cancel</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="NOTICE"
      :visible.sync="deleteVisible"
      width="350px"
      center
    >
      <span>WARNNING: This operation is unreversiable.</span>
      <p>Are you sure?</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteVisible = false">Cancel</el-button>
        <el-button type="danger" @click="onDeleteConfirmed">Delete</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import { getCustomerDB, createCustomer, updateCustomer } from '@/api/customer'
import { getAllUsers , registerUser, deleteUser, changeAuthority } from '@/api/user'
import checkPermission from '@/utils/permission' // 权限判断函数
import store from '@/store'

export default {
    data() {
        return {
            tableData: [],
            filteredData: [],
            totalEntries: 0,
            currentPage: 1,
            pageSize: 100,
            deleteVisible: false,
            search: '',
            loading: true,
            authVisible: false,
            registerVisible : false,
            formLabelWidth : '200px',
            customerCodeFilter : [],
            isEdit: false,
            userId: '',
            form: {
              name: '',
              role: ''
            },
            rules: {
              name: [
                { required: true, message: 'Please input customer name', trigger: 'change' }
              ],
              role: [
                { required: true, message: 'Please select a role', trigger: 'change' }
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
      checkPermission,
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
      onCreateClicked() {
        this.$refs['registerForm'].validate((valid) => {
            if (valid) {
                registerUser(this.form.name, this.form.role).then(() => {
                  this.registerVisible = false
                  this.reloadUsers()
                })
            } else {
                console.log('error submit!!');
                return false;
            }
        });
      },
      onRegisterClicked() {
        this.form.role = ''
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
      },
      onDeleteClicked(id) {
        this.userId = id
        this.deleteVisible = true
      },
      onDeleteConfirmed() {
        deleteUser(this.userId).then(() => {
          this.reloadUsers()
          this.deleteVisible = false
        })
      },
      onChangeClicke(id) {
        this.userId = id
        this.authVisible = true
        this.form.role = ''
      },
      onChangeConfirmed() {
        this.$refs['authority-form'].validate((valid) => {
            if (valid) {
              changeAuthority(this.userId, this.form.role).then(() => {
                this.reloadUsers()
                this.authVisible = false
              })
            } else {
                console.log('error submit!!');
                return false;
            }
        });
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
