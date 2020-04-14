<template>
  <div>
    <h2>Control Panel</h2>
    <div style="margin-bottom:10px">
      <el-button class="gb-button" :disabled="shipOrder.status!='New Created' && shipOrder.status!='Picking'" type="primary" @click="onSubmitClicked">Submit WO</el-button>
      <el-button class="gb-button" :disabled="shipOrder.status!='Draft'" type="warning" @click="onCallBackClicked">Recall WO</el-button>
    </div>
  </div>
</template>

<script>
/* eslint-disable vue/require-prop-type-constructor */
/* eslint-disable vue/require-prop-types */
import { submitShipOrder } from '@/api/shipping'

export default {
  props: {
    // eslint-disable-next-line vue/require-default-prop
    shipOrder: {},
    // eslint-disable-next-line vue/require-default-prop
    step: 0
  },
  data() {
    return {
      pushVisible: false,
      recallVisible: false
    }
  },
  watch: {
    step: function(val) {
      if (val === 1) {
        this.pushVisible = true
        this.recallVisible = false
      } else if (val >= 2 && val < 6) {
        this.pushVisible = false
        this.recallVisible = true
      } else {
        this.pushVisible = false
        this.recallVisible = false
      }
    }
  },
  mounted() {

  },
  methods: {
    onSubmitClicked() {
      submitShipOrder(this.shipOrder.id).then(() => {
        this.shipOrder.status = 'Draft'
      })
    },
    onCallBackClicked() {
      this.$emit('onCallBackClicked')
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
