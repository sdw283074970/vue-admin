<template>
  <div>
    <h2>Inventory</h2>
    <h3>Container: {{ masterOrder.container }}</h3>
    <h3>Customer: {{ masterOrder.customerCode }}</h3>
    <div style="margin-bottom:10px">
      <el-switch
        v-model="pltVisible"
        style="display: block"
        active-color="#13ce66"
        inactive-color="#ff4949"
        active-text="Plts View"
        inactive-text="Ctns View"
      />
    </div>
    <receiving-wo-inventory-plts :plt-inventory-data="pltInventoryData" :is-visible="pltVisible" :customer-code="masterOrder.customerCode" @reloadOrder="reloadOrder" />
    <receiving-wo-inventory-ctns :ctn-inventory-data="ctnInventoryData" :is-visible="!pltVisible" :customer-code="masterOrder.customerCode" @reloadOrder="reloadOrder" />
    <!-- <el-dialog title="Rough Pack"
            :visible.sync="locationVisible"
            width="450px"
            :lock-scroll="false"
            append-to-body>
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" class="demo-ruleForm">
                    <el-form-item label="Packed Plt Quantity" prop="pltNumber">
                        <el-input v-model.number="ruleForm.pltNumber"></el-input>
                    </el-form-item>
                    <el-form-item label="Packed PLt Size" prop="pltSize">
                        <el-select v-model="ruleForm.pltSize" placeholder="Select Size">
                        <el-option label="P1(Standard Size)" value="P1"></el-option>
                        <el-option label="P2(2X Standard Size)" value="P2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="submitForm('ruleForm')">Pack</el-button>
                        <el-button @click="resetForm('ruleForm')">Reset</el-button>
                    </el-form-item>
                </el-form>
        </el-dialog> -->
  </div>
</template>
<script>
/* eslint-disable */

export default {
    props: {
        masterOrder: {},
        pltInventoryData: Array,
        ctnInventoryData: Array
    },
    data() {
        return {
            step: 0,
            search: '',
            pltVisible: true,
            locationVisible: false,
            totalEntries: 0,
            currentPage: 1,
            pageSize: 20,
            formLabelWidth : '200px',
            customerCodeFilter : []
        };
    },
    components: {
        "receiving-wo-inventory-plts": () => import('@/views/shareview/receiving/receiving-wo-inventory-plts'),
        "receiving-wo-inventory-ctns": () => import('@/views/shareview/receiving/receiving-wo-inventory-ctns')
    },
    methods:{
        reloadOrder() {
          this.$emit('reloadOrder')
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
