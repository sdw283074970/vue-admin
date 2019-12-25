<template>
    <div>
        <h2>Control Panel</h2>
        <div style="margin-bottom:10px">
            <el-button class="gb-button" @click="onSubmitClicked" :disabled="shipOrder.status!='New Created' && shipOrder.status!='Picking'" type="primary">Submit WO</el-button>
            <el-button class="gb-button" @click="onCallBackClicked" :disabled="shipOrder.status!='Draft'" type="warning">Recall WO</el-button>
        </div>
    </div>
</template>

<script>
import { submitShipOrder } from '@/api/shipping'

export default {
    props: {
        shipOrder: {},
        step: 0
    },
    data() {
        return {
            pushVisible: false,
            recallVisible: false
        }
    },
    watch: {
        step: function(val){
            if (val == 1)
            {
                this.pushVisible = true;
                this.recallVisible = false;
            }
            else if (val >= 2 && val < 6)
            {
                this.pushVisible = false;
                this.recallVisible = true;
            }
            else
            {
                this.pushVisible = false;
                this.recallVisible = false;
            }
        }
    },
    mounted() {

    },
    methods:{
        onSubmitClicked(){
            submitShipOrder(this.shipOrder.id).then(() => {
                this.shipOrder.status = 'Draft';
            })
        },
        onCallBackClicked(){
            this.$emit('onCallBackClicked');
        },
    }
}
</script>

<style lang="stylus" scoped>

</style>