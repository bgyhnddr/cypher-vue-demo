<template>
<div v-show = "showSetPrice">
  <div class="vux-demo-header-box wapmain-header" slot="header">
    <x-header :left-options="{showBack: false}">商品价格</x-header>
    <div slot="left" class="onclick-back" @click="onClickBack">返回</div>
  </div>
  <div>

  </div>
</div>
</template>

<script>
import {
  Group,
  Alert,
  XHeader
} from 'vux'

export default {
  components: {
    Group,
    Alert,
    XHeader
  },
  props: {
    showMainPage: {
      type: Boolean
    },
    showSetPrice: {
      type: Boolean
    }
  },
  data() {
    return {

    }
  },
  methods: {
    onClickBack() {
      this.showMainPage = true
      this.showSetPrice = false
    }
  },
  ready() {

  }
}
</script>
