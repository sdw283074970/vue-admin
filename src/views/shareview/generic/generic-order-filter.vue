<template>
  <div style="text-align:center">
    <label for="sku">SKU
      <el-input id="sku" v-model="filter.sku" />
    </label>
    <div style="text-align:right;margin-right:30px">
      <el-button type="primary" @click="onConfirmClicked">Confirm</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filter: {
        sku: ''
      }
    }
  },
  methods: {
    onConfirmClicked() {
      this.$emit('onFilterConfirmed', this.filter)
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
