<template>
  <div>
    <h2>Invoice Detail</h2>
    <div style="margin-bottom:10px">
      <el-button class="gb-button" type="primary" icon="el-icon-plus" :disabled="invoiceStatus=='Closed'" @click="onAddClicked">Add Charging</el-button>
      <el-button class="gb-button" type="primary" icon="el-icon-download" :disabled="invoiceStatus!='Closed'">Export Report</el-button>
      <!-- <el-popover
        v-model="popVisible"
        placement="top"
        width="380"
      >
        <p>All existed instructions & chargings will be overwritten.</p>
        <p>Are you sure you want to continue?</p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="popVisible = false">No</el-button>
          <el-button type="primary" size="mini" @click="onResetClicked">Yes</el-button>
        </div>
        <el-button slot="reference" class="gb-button" type="primary">Reset Instruction</el-button>
      </el-popover> -->
    </div>
    <el-table
      ref="table-instructions"
      :data="invoices"
      show-summary
      :summary-method="getSummaries"
      stripe
      border
    >
      <el-table-column
        sortable
        prop="id"
        label="Id"
        width="60"
      />
      <el-table-column
        prop="activity"
        label="ACT"
        width="150"
      />
      <el-table-column
        prop="chargingType"
        label="TYPE"
        width="100"
      />
      <el-table-column
        prop="unit"
        label="UOM"
        width="120"
      />
      <el-table-column
        prop="quantity"
        align="center"
        label="QTY"
        width="80"
      >
        <template slot-scope="scope">
          <font>{{ scope.row.quantity.toFixed(2) }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="rate"
        align="center"
        label="Rate"
        width="80"
      >
        <template slot-scope="scope">
          <font>{{ '$ ' + scope.row.rate.toFixed(2) }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="originalAmount"
        align="center"
        label="ORG AMT"
        width="100"
      >
        <template slot-scope="scope">
          <font>{{ '$ ' + scope.row.originalAmount.toFixed(2) }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="discount"
        align="center"
        label="DISC"
        width="80"
      >
        <template slot-scope="scope">
          <font>{{ scope.row.discount == 1 ? '-' : ((1 - scope.row.discount) * 100 + '% OFF') }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="amount"
        align="center"
        label="FNL AMT"
        width="100"
      >
        <template slot-scope="scope">
          <font>{{ '$ ' + scope.row.amount.toFixed(2) }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="cost"
        align="center"
        label="COST"
        width="80"
      >
        <template slot-scope="scope">
          <font>{{ '$ ' + scope.row.cost.toFixed(2) }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="net"
        align="center"
        label="NET"
        width="80"
      >
        <template slot-scope="scope">
          <font>{{ '$ ' + scope.row.net.toFixed(2) }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="costConfirm"
        label="COST FONFIRM"
        align="center"
        width="130"
      >
        <template slot-scope="scope">
          <el-button style="width:80px" :type="scope.row.costConfirm==true?'success':'info'" @click="onBtnClicked(scope.row.id, 'Confirm')">{{ scope.row.costConfirm==true?'YES':'NO' }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="collectionStatus"
        label="COLLECTION"
        width="140"
        align="center"
      >
        <template slot-scope="scope">
          <el-button style="width:80px" :type="scope.row.collectionStatus==true?'success':'info'" @click="onBtnClicked(scope.row.id, 'Collection')">{{ scope.row.collectionStatus==true?'YES':'NO' }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="paymentStatus"
        label="PAYMENT"
        align="center"
        width="110"
      >
        <template slot-scope="scope">
          <el-button style="width:80px" :type="scope.row.paymentStatus==true?'success':'info'" @click="onBtnClicked(scope.row.id, 'Payment')">{{ scope.row.paymentStatus==true?'YES':'NO' }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="operation"
        label="operation"
        min-width="25%"
      >
        <template slot-scope="scope">
          <el-dropdown>
            <span class="el-dropdown-link">
              Operations<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :disabled="invoiceStatus=='Closed'" @click="onAddClicked" @click.native="onUpdateClicked(scope.row.id)">Update</el-dropdown-item>
              <el-dropdown-item divided :disabled="invoiceStatus=='Closed'" @click="onAddClicked" @click.native="onDeleteClicked(scope.row.id)">Delete</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="Charging"
      :visible.sync="chargingVisible"
      width="800px"
      top="5vh"
      :lock-scroll="false"
    >
      <invoice-dialog
        :is-edit="isEdit"
        :reference="reference"
        :order-type="orderType"
        :service="service"
        @reloadOrder="reloadOrder"
        @closeDialog="closeDialog"
      />
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import { updateInvoiceStatus, getChargingInfo, deleteChargingDetail } from '@/api/accounting'

export default {
  props: {
    reference: String,
    orderType: String,
    invoiceStatus: String,
    invoices: Array
  },
  components: {
    'invoice-dialog': () => import('@/views/accountingview/invoice/invoice-dialog')
  },
  data() {
      return {
        isEdit: false,
        chargingVisible: false,
        service: {
            activity: '',
            amount: 0,
            chargingType: '',
            cost: 0,
            dateOfCost: '',
            inoviceType: '',
            discount: 1,
            memo: '',
            quantity: 0,
            rate: 0,
            unit: '',
            description: ''
        },
      };
  },
  methods:{
    onBtnClicked(id, type) {
      updateInvoiceStatus(id, type).then(() => {
        this.$emit('reloadOrder')
      })
    },
    onAddClicked() {
      this.chargingVisible = true
      this.isEdit = false
    },
    reloadOrder() {
      this.chargingVisible = false
      this.$emit('reloadOrder')
    },
    closeDialog() {
      this.chargingVisible = false
    },
    onUpdateClicked(id) {
      this.chargingVisible = true
      this.isEdit = true
      getChargingInfo(id).then(body => {
        this.service = body.data
        this.service.id = id
      })
    },
    onDeleteClicked(id) {
      deleteChargingDetail(id).then(() => {
        this.$emit('reloadOrder')
      })
    },
      getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = 'Sum';
            return;
          }

          if (index === 4)
          {

          }

          if (index === 7 || index === 12 || index === 13 || index === 11)
          {
            sums[index] = 'N/A'
            return
          }

          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] = '$ ' + sums[index].toFixed(2);
          } else {
            sums[index] = 'N/A';
          }
        });

        return sums;
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
