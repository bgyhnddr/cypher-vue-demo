<template>
<div>
  <div class="vux-demo-header-box wapmain-header" slot="header">
    <x-header :left-options="{showBack: false}">商品价格</x-header>
    <div slot="left" class="onclick-back" @click="onClickBack">返回</div>
  </div>
  <div>
    <table border="0" width="100%" id="SetProductPrice" cellspacing="0" cellpadding="0" >
      <tr>
        <th>级别名称</th>
        <th>进货价</th>
      </tr>
      <tr v-for="item in BrandRole">
        <th>{{item.name}}</th>
        <th>
          <x-input :value.sync="item.price" @on-change="onChange" @click="selectAll">元</x-input>
        </th>
      </tr>
    </table>
  </div>
  <div class="SetProductPrice-reset">
  <flexbox>
    <flexbox-item>
      <x-button type="default" @click="SubmitPrice" class="SetProductPrice-reset-sure">确认</x-button>
    </flexbox-item>
    <flexbox-item>
      <x-button type="default" @click="ResetPrice">重置</x-button>
    </flexbox-item>
  </flexbox>
</div>
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
    selectAll(e){
      var target = e.currentTarget.getElementsByTagName("input")
      target[0].select()
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
      document.body.style.background = '#f2f2f2'
  }
}
</script>
<style>
#SetProductPrice{
 font-family: "微软雅黑",Arial!important;
 background: #fff;
     padding-top: 46px;
     margin-bottom: 55px;
}
#SetProductPrice tr th{
    border-bottom: 1px solid #d3d1d1;
  font-family: "微软雅黑";
  font-weight: normal;
  line-height: 2.8em;
  font-size: 4.5vw
}
#SetProductPrice tr th:first-child{

  border-right: 1px solid #d3d1d1;


}
#SetProductPrice tr th:first-child{
  width: 50%}
  #SetProductPrice   .weui_cell{
    padding: 0
  }
    #SetProductPrice  .weui_cell_hd{
        width: 7%;
    }
  #SetProductPrice  .weui_cell_ft{
    margin: 0 7% 0 2%;
 color: #000
    }
  #SetProductPrice    .weui_cell_bd.weui_cell_primary {
    border: 1px solid #d3d1d1;
    line-height: 2.2em;}
  #SetProductPrice     i.weui_icon.weui_icon_clear{
    position: absolute;
left: 69%;
  }
  #SetProductPrice   .weui_icon_warn:before{
    position: absolute;
left: 69%;
top: 35%
  }
    #SetProductPrice   .weui_input{
      text-align: center;
    font-family: "微软雅黑",Arial;
    font-weight: 600;
      font-size: 4.5vw

    }
.SetProductPrice-reset{
position: fixed;
bottom:0;
width: 100%
  }
.SetProductPrice-reset  .vux-flexbox-item{
  margin-left:0!important;

}
.SetProductPrice-reset .weui_btn:after{
  border-radius: 0;
  border:0
}
.SetProductPrice-reset button.weui_btn.weui_btn_default {
    background: #9b9b9b;
    border-radius: 0;
    font-family: "微软雅黑";
        font-size: 5.2vw;
    color: #fff;
    line-height: 2.3em;
}
.SetProductPrice-reset button.weui_btn.SetProductPrice-reset-sure.weui_btn_default{
  background: #21c36d
}
</style>
