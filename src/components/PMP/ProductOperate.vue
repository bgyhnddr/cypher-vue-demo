<template>
<div v-show="showProductOperate">
  <!-- 主页 -->
  <div>
    <div class="vux-demo-header-box wapmain-header" slot="header">
      <x-header :left-options="{showBack: false}">商品标题</x-header>
      <div slot="left" class="onclick-back" @click="onClickBack">返回</div>
    </div>
    <Group>
      <div class="weui_cell">
        <img src="" width="100px" height="100px" alt="产品图片">
      </div>
      <div class="weui_cell">
        <div class="weui_cell_bd weui_cell_primary">
          <p>{{ProductInfo.name}}</p>
        </div>
      </div>
      <div class="weui_cell">
        <div class="weui_cell_bd weui_cell_primary">
          <p>￥</p>
        </div>
      </div>
      <div class="weui_cell">
        <div class="weui_cell_bd weui_cell_primary">
          <p>{{ProductInfo.description}}</p>
        </div>
      </div>
    </Group>
    <flexbox>
      <flexbox-item>
        <x-button type="default" @click="editProduct">编辑</x-button>
      </flexbox-item>
      <flexbox-item>
        <x-button type="default">下架</x-button>
      </flexbox-item>
    </flexbox>
  </div>
</div>
</template>

<script>
import {
  Group,
  Alert,
  XHeader,
  Flexbox,
  FlexboxItem,
  XButton
} from 'vux'

export default {
  components: {
    Group,
    Alert,
    XHeader,
    Flexbox,
    FlexboxItem,
    XButton
  },
  props: {
    showMainPage: {
      type: Boolean
    },
    showProductOperate: {
      type: Boolean
    },
    ProductInfo: {
      type: Object
    }
  },
  data() {
    return {

    }
  },
  methods: {
    onClickBack() {
      this.$route.router.go("/productManagement/productSetting")
    },
    editProduct(){
      this.showMainPage = true
      this.showProductOperate = false
    }
  },
  ready() {

  }
}
</script>
<style>

</style>
