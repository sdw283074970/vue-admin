<template>
  <div>
    <h2>Control Panel</h2>
    <div style="margin-bottom:10px">
      <el-button v-if="pushVisible" class="gb-button" type="primary" @click="onPushClicked">Push WO</el-button>
      <el-button v-if="recallVisible" class="gb-button" type="warning" @click="onCallBackClicked">Recall WO</el-button>
      <el-button class="gb-button" type="danger" @click="onPushClicked">Push Status</el-button>
      <el-button class="gb-button" type="danger" @click="onCallBackClicked">Reverse Status</el-button>
    </div>
  </div>
</template>

<script>
/* eslint-disable vue/require-prop-type-constructor */
/* eslint-disable vue/require-default-prop */
/* eslint-disable vue/require-prop-types */
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
    onPushClicked() {
      this.$emit('onPushClicked')
    },
    onCallBackClicked() {
      this.$emit('onCallBackClicked')
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
