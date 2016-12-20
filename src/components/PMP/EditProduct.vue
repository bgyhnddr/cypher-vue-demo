<template>
<div>
  <!-- 主页 -->
  <div v-if="currentActive=='MainPage'">
    <div class="vux-demo-header-box wapmain-header" slot="header">
      <x-header :left-options="{showBack: false}">添加商品</x-header>
      <div slot="left" class="onclick-back" @click="onClickBack">返回</div>
    </div>
    <group>
      <div>
        <x-input placeholder="请输入商品名称" :required="false" :value.sync = "ProductInfo.name"></x-input>
      </div>
      <div class="weui_cell" @click="editProductLabelModel">
        <div class="weui_cell_bd weui_cell_primary">
          <p>品类</p>
          <p>未添加</p>
        </div>
        <div class="weui_cell_ft" :class="{'with_arrow': true}"></div>
      </div>
      <div class="weui_cell" @click="showSetPricePage">
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
    <set-product-price v-if="currentActive=='SetPricePage'" :current-active.sync = "currentActive"></set-product-price>
  </div>
  <div>
    <product-operate v-if="currentActive=='OperatePage'" :current-active.sync = "currentActive" :product-info.sync="ProductInfo"></product-operate>
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

import pmpProductAPI from '../../api/pmp_product'
import SetProductPrice from './SetProductPrice'
import ProductOperate from './ProductOperate'
import EditProductLabel from './EditProductLabel'

export default {
  components: {
    Group,
    Alert,
    XHeader,
    XInput,
    XButton,
    XTextarea,
    SetProductPrice,
    ProductOperate,
    EditProductLabel
  },
  data() {
    return {
      currentActive :"MainPage",
      ProductInfo: {
        "id": "",
        "pmp_brand_id": "",
        "name": "",
        "on_sell": null,
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
    showSetPricePage(){
      this.currentActive = "SetPricePage"
    },
    editProductLabelModel() {
      this.showMainPage = false
      this.showEditProductLabelModel = true
    },
    submitProduct(){

    }
  },
  ready() {
    var that = this
    var id = that.$route.params.id
    if(id){
      that.currentActive = "OperatePage"
      pmpProductAPI.getProduct({id:id}).then((o)=>{
        if(o){
          console.log(o)
          that.ProductInfo.name = o.name
          that.ProductInfo.description = o.description
          that.ProductInfo.on_sell = o.on_sell
        }else{
          console.log('商品读取错误')
        }
      })
    }else{
      that.currentActive = "MainPage"
    }
  }
}
</script>
<style>

</style>
