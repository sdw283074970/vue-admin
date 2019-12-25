<template>
    <div>
        <h2>Control Panel</h2>
        <div style="margin-bottom:10px">
            <el-button class="gb-button" @click="onPushClicked" v-if="pushVisible" type="primary">Push WO</el-button>
            <el-button class="gb-button" @click="onCallBackClicked" v-if="recallVisible" type="warning">Recall WO</el-button>
            <el-button class="gb-button" @click="onPushClicked" type="danger">Push Status</el-button>
            <el-button class="gb-button" @click="onCallBackClicked" type="danger">Reverse Status</el-button>
        </div>
    </div>
</template>

<script>
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
        onPushClicked(){
            this.$emit('onPushClicked');
        },
        onCallBackClicked(){
            this.$emit('onCallBackClicked');
        }
    }
}
</script>

<style lang="stylus" scoped>

</style>