<template>
  <div class="dashboard-editor-container">
    <!-- <github-corner class="github-corner" /> -->

    <panel-group :line-chart-data-sum-set="lineChartDataSumSet" @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" :title-suffix="lineChartTitleSuffix" />
      <div style="margin-bottom:20px;text-align:right">
        <el-button :loading="loading" @click="onDaysClicked">30 Days</el-button>
        <el-button :loading="loading" @click="onWeeksClicked">7 Weeks</el-button>
        <el-button :loading="loading" @click="onMonthsClicked">12 Months</el-button>
      </div>
    </el-row>

    <!-- <el-row style="background:#fff;padding:16px;margin-bottom:32px;">
      <transit-reminder />
    </el-row> -->
    <!-- <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row> -->

    <!-- <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <todo-list />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <box-card />
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
// import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
// import TransitReminder from './components/TransitReminder'
// import RaddarChart from './components/RaddarChart'
// import PieChart from './components/PieChart'
// import BarChart from './components/BarChart'
// import TransactionTable from './components/TransactionTable'
// import TodoList from './components/TodoList'
// import BoxCard from './components/BoxCard'

import { getLinerChart } from '@/api/dashboard'

// const lineChartData = {
//   newVisitis: {
//     dataA: [100, 120, 161, 134, 105, 160, 165],
//     dataB: [120, 82, 91, 154, 162, 140, 145]
//   },
//   messages: {
//     dataA: [200, 192, 120, 144, 160, 130, 140],
//     dataB: [180, 160, 151, 106, 145, 150, 130]
//   },
//   purchases: {
//     dataA: [80, 100, 121, 104, 105, 90, 100],
//     dataB: [120, 90, 100, 138, 142, 130, 130]
//   },
//   shoppings: {
//     dataA: [130, 140, 141, 142, 145, 150, 160],
//     dataB: [120, 82, 91, 154, 162, 140, 130]
//   }
// }

export default {
  name: 'DashboardAdmin',
  components: {
    // GithubCorner,
    // RaddarChart,
    // PieChart,
    // BarChart
    // TransactionTable,
    // TodoList,
    // BoxCard,
    PanelGroup,
    LineChart
    // TransitReminder
  },
  data() {
    return {
      loading: false,
      lineChartTitleSuffix: '',
      lineChartData: {},
      lineChartDataSet: {},
      lineChartDataSumSet: {
        inboundPlts: 0,
        outboundPlts: 0,
        inboundCtns: 0,
        outboundCtns: 0,
        inboundIncomes: 0,
        outboundIncomes: 0,
        inboundCosts: 0,
        outboundCots: 0,
        inboundProfits: 0,
        outboundProfits: 0
      }
    }
  },
  mounted() {
    this.getLineDataByParam('Week', 7)
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = this.lineChartDataSet[type]
    },
    getLineDataByParam(timeUnit, timeCount) {
      getLinerChart(timeUnit, timeCount).then(body => {
        this.lineChartData = body.data[0]
        this.lineChartDataSet.pltsData = body.data[0]
        this.lineChartDataSumSet.inboundPlts = body.data[0].inboundData.reduce((sum, current) => { return sum + current }, 0)
        this.lineChartDataSumSet.outboundPlts = body.data[0].outboundData.reduce((sum, current) => { return sum + current }, 0)

        this.lineChartDataSet.ctnsData = body.data[1]
        this.lineChartDataSumSet.inboundCtns = body.data[1].inboundData.reduce((sum, current) => { return sum + current }, 0)
        this.lineChartDataSumSet.outboundCtns = body.data[1].outboundData.reduce((sum, current) => { return sum + current }, 0)

        this.lineChartDataSet.incomesData = body.data[2]
        this.lineChartDataSumSet.inboundIncomes = body.data[2].inboundData.reduce((sum, current) => { return sum + current }, 0)
        this.lineChartDataSumSet.outboundIncomes = body.data[2].outboundData.reduce((sum, current) => { return sum + current }, 0)

        this.lineChartDataSet.costsData = body.data[3]
        this.lineChartDataSumSet.inboundCosts = body.data[3].inboundData.reduce((sum, current) => { return sum + current }, 0)
        this.lineChartDataSumSet.outboundCosts = body.data[3].outboundData.reduce((sum, current) => { return sum + current }, 0)

        this.lineChartDataSet.profitsData = body.data[4]
        this.lineChartDataSumSet.inboundProfits = body.data[4].inboundData.reduce((sum, current) => { return sum + current }, 0)
        this.lineChartDataSumSet.outboundProfits = body.data[4].outboundData.reduce((sum, current) => { return sum + current }, 0)

        this.loading = false
        this.lineChartTitleSuffix = 'in ' + timeCount + ' ' + timeUnit + 's'
      })
    },
    onDaysClicked() {
      this.loading = true
      this.getLineDataByParam('Day', 30)
    },
    onWeeksClicked() {
      this.loading = true
      this.getLineDataByParam('Week', 7)
    },
    onMonthsClicked() {
      this.loading = true
      this.getLineDataByParam('Month', 12)
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
