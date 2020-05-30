<template>
  <div>
    <el-button style="margin:10px" icon="el-icon-back" @click="onBackClicked">Back</el-button>
    <el-button type="primary" style="margin:10px" icon="el-icon-plus" @click="onNewClicked">Add Charging Ladder</el-button>
    <el-table
      ref="label-files-table"
      :data="sortedData"
      stripe
      border
      height="500"
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="Id"
        align="center"
        width="60"
      />
      <el-table-column
        label="Customer Code"
        width="100"
        align="center"
      >
        <template>
          <font>{{ storageTemp.customerCode }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="from"
        label="From"
        width="140"
        align="center"
      >
        <template slot-scope="scope">
          <font>{{ transTimeUnit(scope.row.from, storageTemp.chargePeriod) }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="to"
        label="To"
        width="140"
        align="center"
      >
        <template slot-scope="scope">
          <font>{{ transTimeUnit(scope.row.to, storageTemp.chargePeriod) }}</font>
        </template>
      </el-table-column>
      <el-table-column
        label="Duration"
        width="140"
        align="center"
      >
        <template slot-scope="scope">
          <font>{{ (scope.row.to - scope.row.from + 1) + ' ' + storageTemp.chargePeriod + ((scope.row.to - scope.row.from + 1) == 1 ? '' : 's') }}</font>
        </template>
      </el-table-column>
      <el-table-column
        label="Rate/TUOM"
        width="140"
        align="center"
      >
        <template slot-scope="scope">
          <font>{{ scope.row.fee.toFixed(2) + ' ' + storageTemp.currency + '/' + storageTemp.chargePeriod }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="operation"
        align="center"
        label="operation"
      >
        <template slot-scope="scope">
          <el-dropdown>
            <span class="el-dropdown-link">
              Options<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="onEditClicked(scope.row.id)">Edit</el-dropdown-item>
              <el-dropdown-item divided :disabled="sortedData[sortedData.length-1].from!=scope.row.from" @click.native="onDeleteClicked(scope.row.id)">Delete</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="storageTemp.customerCode + ' Charging Ladder'" :visible.sync="detailDialogVisible" top="15vh" width="350px" append-to-body>
      <storage-details-dialog :storage-temp="storageTemp" :temp-details="tempDetails" :is-edit="isEdit" :ladder="ladder" @reloadStorageDetails="reloadStorageDetails" @closeDialog="closeDialog" />
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import config from '@/scripts/global'
import { deleteStorageDetail } from '@/api/customer'

const baseURL = config.baseURL

export default {
  props: {
      storageTemp: Object,
      customerId: Number,
      tempDetails: Array
  },
  data() {
    return {
        isEdit: false,
        detailDialogVisible: false,
        ladder: {
            id: 0,
            from: '',
            to: '',
            fee: ''
        }
    }
  },
  computed: {
      fromTime: function() {
          return this.tempDetails.length == 0 ? 1 : this.tempDetails.sort((a, b) => {return b.from - a.from})[0].to + 1
      },
      sortedData: function() {
          return this.tempDetails.sort((a, b) => {return a.from - b.from})
      }
  },
  components: {
      "storage-details-dialog": () => import('@/views/officeview/customer/storage-details-dialog')
  },
  methods:{
    transferDate: function(date){
        return date.substring(0,10);
    },
    transTimeUnit(num, timeUnit) {
        var unit = ''
        switch(num) {
            case 1:
                unit = 'st'
                break;
            case 2:
                unit = 'nd'
                break;
            case 3:
                unit = 'rd'
                break;
            default:
                unit = 'th'
        } 
        return num + unit + ' ' + timeUnit
    },
    onNewClicked() {
        this.isEdit = false
        let defaultFrom = this.fromTime
        this.ladder = {
            from: defaultFrom,
            to: defaultFrom,
            fee: ''
        }
        this.detailDialogVisible = true
    },
    onEditClicked(id) {
        let l = this.tempDetails.find(x => x.id == id)
        this.ladder.id = id
        this.ladder.from = l.from
        this.ladder.to = l.to
        this.ladder.fee = l.fee
        this.isEdit = true
        this.detailDialogVisible = true
    },
    reloadStorageDetails() {
      this.detailDialogVisible = false
      this.$emit('reloadStorageDetails')
    },
    closeDialog() {
      this.detailDialogVisible = false
    },
    onDeleteClicked(id) {
      deleteStorageDetail(id).then(() => {
        this.$emit('reloadStorageDetails')
      })
    },
    onBackClicked() {
        this.$emit('closeDetailOnly')
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
</style>
