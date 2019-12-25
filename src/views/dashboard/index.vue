<template>
  <div class="dashboard-container">
    <div class="dashboard-text">此处为您的定制页面，请联系您在Grand Channel的联系人来获取定制主页的方法</div>
  </div>
</template>

<script>
/* eslint-disable */
import { getDashboard } from '@/api/dashboard'
import { deflateRaw } from 'zlib'

export default {
  name: 'Dashboard',
  data: function() {
    return {
      v: 'Welcome!'
    }
  },
  methods: {
    btnClick: function(){
      $("#input-test").val('success!')
    }
  },
  mounted() {
    getDashboard().then(body => {
      // alert(JSON.stringify(body.data))
    })
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
