<template>
<div class="vux-demo-header-box wapmain-header" slot="header">
  <x-header :left-options="leftOptions"></x-header>
  <div slot="left" class="onclick-back" @click="headerGoBack">返回</div>
</div>
<div>
</div>
<div>
  <alert :show.sync="showCatchError" button-text="确认" @on-hide="errorHandled">{{catchErrorMsg}}</alert>
</div>
<div class="all-footer">© 2016 ShareWin.me 粤ICP备14056388号</div>
</div>
</template>

<script>
import {
  XHeader,
  Alert
} from 'vux'
import pmpProductAPI from '../../api/pmp_product'

export default {
  components: {
    XHeader,
    Alert
  },
  data() {
    return {
      leftOptions: {
        showBack: false,
        backText: null,
        preventGoBack: false
      },
      alert: {
        showCatchError: false,
        catchErrorMsg: null
      }
    }
  },
  methods: {
    headerGoBack() {
      this.$route.router.go("/productManagement/productSetting")
    }
  }
}
</script>
