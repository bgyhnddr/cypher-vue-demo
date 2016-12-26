<template>
<div>
  <div class="vux-demo-header-box wapmain-header" slot="header">
    <x-header :left-options="{showBack: false}">商品价格</x-header>
    <div slot="left" class="onclick-back" @click="onClickBack">返回</div>
  </div>
  <div>
    <table border="1" width="100%">
      <tr>
        <th>级别名称</th>
        <th>进货价</th>
      </tr>
      <tr v-for="item in BrandRole">
        <th>{{item.name}}</th>
        <th>
          <x-input :value.sync="item.price" @on-change="onChange">元</x-input>
        </th>
      </tr>
    </table>
  </div>
  <flexbox>
    <flexbox-item>
      <x-button type="default" @click="SubmitPrice">确认</x-button>
    </flexbox-item>
    <flexbox-item>
      <x-button type="default" @click="ResetPrice">重置</x-button>
    </flexbox-item>
  </flexbox>
</div>
<alert :show.sync="showAlert" button-Text="好的" @on-hide="Hide">请正确输入金额</alert>
</template>

<script>
import {
  Group,
  Alert,
  XHeader,
  Flexbox,
  FlexboxItem,
  XButton,
  XInput
} from 'vux'

import pmpProductAPI from '../../api/pmp_product'

export default {
  components: {
    Group,
    Alert,
    XHeader,
    Flexbox,
    FlexboxItem,
    XButton,
    XInput
  },
  props: {
    currentActive: {
      type: String
    },
    ProductInfo: {
      type: Object
    }
  },
  data() {
    return {
      BrandRole: [],
      InputValid:true,
      showAlert:false
    }
  },
  methods: {
    onClickBack() {
      if(this.InputValid){
        this.currentActive = "MainPage"
      }
    },
    ResetPrice() {
      this.BrandRole.forEach((o) => {
        o.price = "0.00"
      })
    },
    Hide(){
      this.InputValid = true
    },
    SubmitPrice() {
      if (this.ProductInfo.pmp_product_prices.length == 0) {
        this.BrandRole.forEach((o) => {
          if(isNaN(o.price)||o.price==""){
            this.showAlert = true
            this.InputValid = false
            o.price = "0.00"
          }
          this.ProductInfo.pmp_product_prices.push({
            brand_role_name: o.name,
            brand_role_code: o.level,
            price: parseFloat(o.price).toFixed(2),
            price_unit:"RMB"
          })
        })
      } else {
        this.BrandRole.forEach((o) => {
          if(isNaN(o.price)||o.price==""){
            this.showAlert = true
            this.InputValid = false
            o.price = "0.00"
          }else{
            this.ProductInfo.pmp_product_prices.filter(i => i.brand_role_code == o.level).map((t) => {
              t.brand_role_name = o.name
              t.brand_role_code = o.level
              t.price = parseFloat(o.price).toFixed(2)
            })
          }
        })
      }
      this.onClickBack()
    },
    onChange(val) {
    }
  },
  ready() {
    //获取代理信息
    var price = this.ProductInfo.pmp_product_prices
    pmpProductAPI.getBrandRoles().then((o) => {
      o.forEach((c) => {
        var setPrice = price.filter(d => d.brand_role_code == c.level)
        var MergePrice = setPrice[0] === undefined ? "0.00" : setPrice[0].price
        this.BrandRole.push({
          name: c.name,
          level: c.level,
          price: price.length == 0 ? "0.00" : MergePrice
        })
      })
    })
    console.log(this.ProductInfo.pmp_product_prices)
  }
}
</script>
