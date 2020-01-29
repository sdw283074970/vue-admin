<template>
  <div>
    <h2>Invoice Detail</h2>
    <!-- <div style="margin-bottom:10px">
      <el-button class="gb-button" type="primary" icon="el-icon-plus" @click="onNewClicked">New</el-button>
      <el-popover
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
      </el-popover>
    </div> -->
    <el-table
      ref="table-instructions"
      :data="invoices"
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
        <!-- <template slot-scope="scope">
          <el-dropdown>
            <span class="el-dropdown-link">
              Operations<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="onUpdateClicked(scope.row.id)">Update</el-dropdown-item>
              <el-dropdown-item :disabled="!(scope.row.handlingStatus=='Pending'||scope.row.handlingStatus=='Updated')" @click.native="onResultClicked(scope.row.id)">Result</el-dropdown-item>
              <el-dropdown-item divided @click.native="deleteHandler(scope.row.id)">Delete</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template> -->
      </el-table-column>
    </el-table>
    <!-- <el-dialog
      title="Instruction & Charging"
      :visible.sync="instructionVisible"
      width="40%"
      top="5vh"
      :lock-scroll="false"
    >
      <picking-wo-instructions-dialog
        :instruction="instruction"
        :is-result="isResult"
        :is-edit="isEdit"
        :step="step"
        :reference="masterOrder.container"
        :order-type="orderType"
        @onUpdateSucceed="onUpdateSucceed"
        @onCancelClicked="onCancelClicked"
        @onCreatedSucceed="onCreatedSucceed"
        @onResultSucceed="onResultSucceed"
      />
    </el-dialog> -->
  </div>
</template>

<script>
/* eslint-disable */
import { updateInvoiceStatus } from '@/api/accounting'

export default {
  props: {
    reference: String,
    orderType: String,
    invoiceStatus: String,
    invoices: Array
  },
  data() {
      return {
      };
  },
  methods:{
    onBtnClicked(id, type) {
      updateInvoiceStatus(id, type).then(() => {
        this.$emit('reloadOrder')
      })
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
