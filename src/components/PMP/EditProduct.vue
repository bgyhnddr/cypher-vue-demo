<template>
<div>
  <!-- 主页 -->
  <div v-if="showMainPage">
    <div class="vux-demo-header-box wapmain-header" slot="header">
      <x-header :left-options="{showBack: false}">添加商品</x-header>
      <div slot="left" class="onclick-back" @click="onClickBack">返回</div>
    </div>
    <group>
      <div>
        <x-input placeholder="请输入商品名称" :required="false" :value.sync = "ProductInfo.name"></x-input>
      </div>
      <div class="weui_cell">
        <div class="weui_cell_bd weui_cell_primary">
          <p>品类</p>
          <p>未添加</p>
        </div>
        <div class="weui_cell_ft" :class="{'with_arrow': true}"></div>
      </div>
      <div class="weui_cell" @click="EditPrice">
        <div class="weui_cell_bd weui_cell_primary">
          <p>商品价格</p>
          <p>设置等级价格目录表</p>
        </div>
        <div class="weui_cell_ft" :class="{'with_arrow': true}"></div>
      </div>
      <div class="weui_cell">
        <div class="weui_cell_bd weui_cell_primary">
          <p>商品描述</p>
          <x-textarea :max="200" placeholder="请输入商品描述" :value.sync = "ProductInfo.description"></x-textarea>
        </div>
      </div>
      <div class="weui_cell" v-if="!BtnFlag">
        <x-button plain>添加商品规格</x-button>
      </div>
    </group>
    <div>
      <x-button plain @click="submitProduct">加入商品</x-button>
    </div>
  </div>
  <!-- 子组件页 -->
  <div>
    <set-product-price :show-main-page.sync="showMainPage" :show-set-price.sync="showSetPrice"></set-product-price>
  </div>
  <div>
    <product-info :show-main-page.sync="showMainPage" :show-product-info.sync="showProductInfo"></product-info>
  </div>
</div>
</template>

<script>
import {
  Group,
  Alert,
  XHeader,
  XInput,
  XButton,
  XTextarea
} from 'vux'
import SetProductPrice from './SetProductPrice'
import ProductInfo from './ProductInfo'

export default {
  components: {
    Group,
    Alert,
    XHeader,
    XInput,
    XButton,
    XTextarea,
    SetProductPrice,
    ProductInfo
  },
  data() {
    return {
      showMainPage:true,
      showProductInfo:false,
      showSetPrice:false,
      showSetLabels:false,
      ProductInfo: {
        "id": "",
        "pmp_brand_id": "",
        "name": "",
        "on_sell": true,
        "description": "",
        "pmp_variants": [],
        "pmp_product_labels": [],
        "pmp_product_prices": []
      }
    }
  },
  methods: {
    onClickBack() {
      this.$route.router.go('/productManagement/productSetting')
    },
    EditPrice(){
      this.showMainPage = false
      this.showSetPrice = true
    },
    submitProduct(){
      console.log(this.ProductInfo)
    }
  },
  ready() {
    var id = this.$route.params.id
    if(id){

    }
  }
}
</script>
<style>

</style>
