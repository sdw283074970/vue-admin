<template>
  <div id="acct-all-invoice">
    <h2>Invoice Detail</h2>
    <div style="margin-bottom:10px">
      <el-button id="acct-all-invoice-regular" class="gb-button" type="primary" icon="el-icon-plus" :disabled="invoiceStatus!='Await'" :loading="loading" @click="onAddClicked">Regular Charging</el-button>
      <el-button id="acct-all-invoice-extra" class="gb-button" type="primary" icon="el-icon-plus" :disabled="invoiceStatus!='Await'" :loading="loading" @click="onExtraClicked">Extra Charging</el-button>
      <el-button id="acct-all-invoice-cost" class="gb-button" type="primary" icon="el-icon-plus" :disabled="invoiceStatus=='Closed'" :loading="loading" @click="onAddCostClicked">Add Cost</el-button>
      <el-button id="acct-all-invoice-report" class="gb-button" type="primary" icon="el-icon-download" :disabled="invoiceStatus=='Await'" :loading="loading" @click="downloadInvoiceHandler">Export Report</el-button>
      <el-button icon="el-icon-info" @click.prevent.stop="guide">Guide</el-button>
    </div>
    <el-table
      id="acct-all-invoice-table"
      ref="table-instructions"
      :data="invoices"
      show-summary
      :summary-method="getSummaries"
      stripe
      border
    >
      <el-table-column
        prop="id"
        label="Id"
        width="60"
        sortable
      />
      <el-table-column
        prop="activity"
        label="ACT"
        width="150"
      />
      <el-table-column
        prop="chargingType"
        label="TYPE"
        width="110"
      />
      <el-table-column
        prop="unit"
        label="UOM"
        width="100"
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
        width="80"
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
          <font>{{ scope.row.discount == 1 ? '-' : ((1 - scope.row.discount).toFixed(2) * 100 + '% OFF') }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="amount"
        align="center"
        label="FNL AMT"
        width="80"
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
        label="COST CFRM"
        align="center"
        width="115"
      >
        <template slot-scope="scope">
          <el-button style="width:80px" :type="scope.row.costConfirm==true?'success':'info'" @click="onBtnClicked(scope.row.id, 'Confirm')">{{ scope.row.costConfirm==true?'YES':'NO' }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="paymentStatus"
        label="PAYMENT"
        align="center"
        width="115"
      >
        <template slot-scope="scope">
          <el-button style="width:80px" :type="scope.row.paymentStatus==true?'success':'info'" @click="onBtnClicked(scope.row.id, 'Payment')">{{ scope.row.paymentStatus==true?'YES':'NO' }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="collectionStatus"
        label="COLLECTION"
        width="115"
        align="center"
      >
        <template slot-scope="scope">
          <el-button style="width:80px" :type="scope.row.collectionStatus==true?'success':'info'" @click="onBtnClicked(scope.row.id, 'Collection')">{{ scope.row.collectionStatus==true?'YES':'NO' }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="bonusStatus"
        label="BONUS CFRM"
        width="115"
        align="center"
      >
        <template slot-scope="scope">
          <el-button style="width:80px" :type="scope.row.bonusStatus==true?'success':'info'" @click="onBtnClicked(scope.row.id, 'Bonus')">{{ scope.row.bonusStatus==true?'YES':'NO' }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="memo"
        label="MEMO"
      />
      <el-table-column
        prop="operation"
        label="OPERATION"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <el-dropdown>
            <span class="el-dropdown-link">
              Options<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :disabled="invoiceStatus=='Closed'" @click="onAddClicked" @click.native="onUpdateClicked(scope.row.id, scope.row.chargingType)">Update</el-dropdown-item>
              <!-- <el-dropdown-item :disabled="invoiceStatus=='Closed'" @click="onAddClicked" @click.native="onUpdateClicked(scope.row.id)">Update</el-dropdown-item> -->
              <el-dropdown-item divided :disabled="invoiceStatus=='Closed'||(scope.row.chargingType!='Cost'&&invoiceStatus=='Generated')" @click="onAddClicked" @click.native="onDeleteClicked(scope.row.id)">Delete</el-dropdown-item>
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
        :invoice-status="invoiceStatus"
        @reloadOrder="reloadOrder"
        @closeDialog="closeDialog"
      />
    </el-dialog>
    <el-dialog
      title="Add Extra Charging"
      :visible.sync="extraVisible"
      width="800px"
      top="5vh"
      :lock-scroll="false"
    >
      <invoice-dialog-extra
        :is-edit="isEdit"
        :reference="reference"
        :order-type="orderType"
        :service="extra"
        :invoice-status="invoiceStatus"
        @reloadOrder="reloadOrder"
        @closeDialog="closeDialog"
      />
    </el-dialog>
    <el-dialog
      title="Add Cost"
      :visible.sync="costVisible"
      width="800px"
      top="5vh"
      :lock-scroll="false"
    >
      <invoice-dialog-cost
        :is-edit="isEdit"
        :reference="reference"
        :order-type="orderType"
        :service="cost"
        :invoice-status="invoiceStatus"
        @reloadOrder="reloadOrder"
        @closeDialog="closeDialog"
      />
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import { updateInvoiceStatus, getChargingInfo, deleteChargingDetail, generateInvoice } from '@/api/accounting'
import { downloadFile } from '@/api/receiving'
import { checkPermission } from '@/utils/permission' // 权限判断函数
import { acct_all_invoice } from '@/guide/steps'

export default {
  props: {
    reference: String,
    orderType: String,
    invoiceStatus: String,
    invoices: Array
  },
  components: {
    'invoice-dialog': () => import('@/views/accountingview/invoice/invoice-dialog'),
    'invoice-dialog-extra': () => import('@/views/accountingview/invoice/invoice-dialog-extra'),
    'invoice-dialog-cost': () => import('@/views/accountingview/invoice/invoice-dialog-cost')
  },
  data() {
      return {
        isEdit: false,
        driver: null,
        chargingVisible: false,
        costVisible: false,
        extraVisible: false,
        loading: false,
        service: {
            activity: '',
            amount: 0,
            originalAmount: 0,
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
        cost: {
            activity: '',
            originalAmount: 0,
            amount: 0,
            chargingType: 'Cost',
            cost: 0,
            dateOfCost: '',
            inoviceType: '',
            discount: 1,
            memo: '',
            quantity: 0,
            rate: 0,
            unit: 'N/A',
            description: ''
        },
        extra: {
            activity: '',
            amount: 0,
            originalAmount: 0,
            chargingType: 'Extra Charging',
            cost: 0,
            dateOfCost: '',
            inoviceType: '',
            discount: 1,
            memo: '',
            quantity: 0,
            rate: 0,
            unit: 'N/A',
            description: ''
        }
      };
  },
  methods:{
    guide() {
      this.driver.defineSteps(acct_all_invoice)
      this.driver.start()
    },
    onBtnClicked(id, type) {
      updateInvoiceStatus(id, type).then(() => {
        this.$emit('reloadOrder')
      })
    },
    onAddClicked() {
      this.chargingVisible = true
      this.isEdit = false
      this.service = {
        activity: '',
        originalAmount: 0,
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
      }
    },
    onAddCostClicked() {
      this.costVisible = true
      this.isEdit = false
      this.cost = {
          activity: '',
          originalAmount: 0,
          amount: 0,
          chargingType: 'Cost',
          cost: 0,
          dateOfCost: '',
          inoviceType: '',
          discount: 1,
          memo: '',
          quantity: 0,
          rate: 0,
          unit: 'N/A',
          description: ''
      }
    },
    onExtraClicked() {
      this.extraVisible = true
      this.isEdit = false
      this.extra = {
          activity: '',
          amount: 0,
          originalAmount: 0,
          chargingType: 'Extra Charging',
          cost: 0,
          dateOfCost: '',
          inoviceType: '',
          discount: 1,
          memo: '',
          quantity: 0,
          rate: 0,
          unit: 'N/A',
          description: ''
      }
    },
    reloadOrder() {
      this.chargingVisible = false
      this.$emit('reloadOrder')
    },
    closeDialog() {
      this.chargingVisible = false
      this.costVisible = false
      this.extraVisible = false
    },
    onUpdateClicked(id, type) {

      if (type == 'Cost')
        this.costVisible = true
      else if (type == 'Extra Charging')
        this.extraVisible = true
      else
        this.chargingVisible = true

      this.isEdit = true

      getChargingInfo(id).then(body => {
        this.service = body.data
        this.service.id = id

        this.cost = body.data
        this.cost.id = id

        this.extra = body.data
        this.extra.id = id
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
          return
        }

        if (index === 4)
        {
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              return prev + curr;
            }, 0);
            sums[index] = sums[index].toFixed(2)
          }
          return
        }

        if (index === 5 || index === 7 || index === 12 || index === 13 || index === 11 || index === 14)
        {
          sums[index] = '-'
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
          sums[index] = '-';
        }
      });

      return sums;
    },
    downloadInvoiceHandler() {
      this.loading = true
      generateInvoice(this.reference, this.orderType).then(body => {
        this.$message({
          message: 'Downloading...',
          type: 'success'
        })
        downloadFile(body.data, 'Invoice')
        this.loading = false
      }).catch(error => {
        this.loading = false
      })
    }
  },
  mounted() {
    this.driver = new this.$driver()
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
