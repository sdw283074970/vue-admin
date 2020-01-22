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

    <receiving-wo-allocate-plts :plt-data="pltData" :is-visible="pltVisible" @reloadOrder="reloadOrder" />
    <receiving-wo-allocate-ctns :ctn-data="ctnData" :is-visible="!pltVisible" />

    <div style="margin-top:10px;text-align:right;">
      <el-button @click="onAllocateSelectedClicked">Allocate All Selected Items</el-button>
      <el-button>Allocate All Filled Items</el-button>
    </div>
  </div>
</template>
<script>
/* eslint-disable */

const validateAcquaintance = (rule, value, callback) => {
  if (!value) {
    callback(new Error('Please enter valid pallet number'))
  }
  value = Number(value)
  if (typeof value === 'number' && !isNaN(value)) {
    if (value < 1) {
      callback(new Error('Pallet number cannot be smaller than 1'))
    } else {
      callback()
    }
  } else {
    callback(new Error('Please enter valid pallet number'))
  }
}

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
        onAllocateSelectedClicked() {
          alert(this.pltData)
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
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
