<template>
  <div>
    <h1>Allocate Location</h1>
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

    <receiving-wo-allocate-plts :plt-data="pltData" :is-visible="pltVisible" />
    <receiving-wo-allocate-ctns :ctn-data="ctnData" :is-visible="!pltVisible" />

    <div style="margin-top:10px;text-align:right;">
      <el-button>Allocate All Selected Items</el-button>
      <el-button>Allocate All Filled Items</el-button>
    </div>
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
        pltData: Array,
        ctnData: Array
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
            customerCodeFilter : [],
                ruleForm: {
                    pltNumber: '',
                    pltSize: 'P1'
                },
                rules: {
                pltNumber: [
                        { validator: validateAcquaintance, trigger: 'blur' }                    
                    ],
                pltSize: [
                        { required: true, message: 'Please select size', trigger: 'change' },
                    ]
                }
        };
    },
    components: {
        "receiving-wo-allocate-plts": () => import('@/views/shareview/receiving/receiving-wo-allocate-plts'),
        "receiving-wo-allocate-ctns": () => import('@/views/shareview/receiving/receiving-wo-allocate-ctns')
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
        resetForm(formName) {
            this.$refs[formName].resetFields();
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
