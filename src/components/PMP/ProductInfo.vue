<template>
<div v-show="showProductInfo">
  <!-- 主页 -->
  <div>
    <div class="vux-demo-header-box wapmain-header" slot="header">
      <x-header :left-options="{showBack: false}">商品标题</x-header>
      <div slot="left" class="onclick-back" @click="onClickBack">返回</div>
    </div>
  </div>
</div>
</template>

<script>
import {
  Group,
  Alert,
  XHeader,
} from 'vux'

export default {
  components: {
    Group,
    Alert,
    XHeader
  },
  data() {
    return {
    }
  },
  methods: {
    onClickBack() {
    }
  },
  ready() {
  }
}
</script>
<style>

</style>
