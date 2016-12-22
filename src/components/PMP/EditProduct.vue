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
        <x-input placeholder="请输入商品名称" :required="false" :value.sync="ProductInfo.name"></x-input>
      </div>
      <cell is-link @click="showEditLabelPage">
        <span v-if="ProductInfo.pmp_product_labels.length == 0">未添加</span>
        <span v-for="item in ProductInfo.pmp_product_labels">{{item}}</span>
        <div slot="icon">
          <span>品类</span>
        </div>
      </cell>
      <cell is-link @click="showSetPricePage">
        <span>设置等级价格目录表</span>
        <div slot="icon">
          <span>商品价格</span>
        </div>
      </cell>
      <table border="1" width="100%" v-if="ProductInfo.pmp_product_prices.length>0">
        <tr v-for="item in ProductInfo.pmp_product_prices">
          <th>{{item.brand_role_name}}</th>
          <th>{{item.price}}元</th>
        </tr>
      </table>
      <cell>
        <div slot="icon">
          <span>商品描述</span>
        </div>
      </cell>
      <x-textarea :max="200" placeholder="请输入商品描述" :value.sync="ProductInfo.description"></x-textarea>
      <cell title="" is-link v-for="item in ProductInfo.pmp_variants">
        <div slot="icon">
          <span>{{item.name}}</span>
        </div>
        <div slot="after-title">
          <span v-for="size in item.pmp_specifications">{{size}}</span>
        </div>
        <span v-if="item.on_sell">已下架</span>
      </cell>
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
    <set-product-price v-if="currentActive=='SetPricePage'" :current-active.sync="currentActive" :product-info.sync="ProductInfo"></set-product-price>
    <product-operate v-if="currentActive=='OperatePage'" :current-active.sync="currentActive" :product-info.sync="ProductInfo"></product-operate>
    <edit-product-label v-if="currentActive=='EditLabelPage'" :current-active.sync="currentActive" :product-info.sync="ProductInfo"></edit-product-label>
  </div>
</div>
</template>

<script>
import {
  Group,
  Cell,
  Alert,
  XHeader,
  XInput,
  XButton,
  XTextarea,
  Flexbox,
  FlexboxItem
} from 'vux'

import pmpProductAPI from '../../api/pmp_product'
import SetProductPrice from './SetProductPrice'
import ProductOperate from './ProductOperate'
import EditProductLabel from './EditProductLabel'

export default {
  components: {
    Group,
    Cell,
    Alert,
    XHeader,
    XInput,
    XButton,
    XTextarea,
    SetProductPrice,
    ProductOperate,
    EditProductLabel,
    Flexbox,
    FlexboxItem
  },
  data() {
    return {
      currentActive: "MainPage",
      ProductInfo: {
        "id": "",
        "pmp_brand_id": "",
        "name": "",
        "on_sell": null,
        "description": "",
        "pmp_variants": [],
        "pmp_product_labels": [],
        "pmp_product_prices": []
      },
      PriceInfo: []
    }
  },
  methods: {
    onClickBack() {
      this.$route.router.go('/productManagement/productSetting')
    },
    showSetPricePage() {
      this.currentActive = "SetPricePage"
    },
    showEditLabelPage() {
      this.currentActive = "EditLabelPage"
    },
    submitProduct() {
      console.log(this.ProductInfo)
    }
  },
  ready() {
    var that = this
    var id = that.$route.params.id
    if (id) {
      that.currentActive = "OperatePage"
      pmpProductAPI.getProduct({
          id: id
        }).then((o) => {
          if (o) {
            console.log(o)
            var specifications = []
            var images = []
              // var variants = [{id:",name:"",pmp_specifications:[{name:""}],pmp_variant_images:[{attachment_id:""}]}]
            that.ProductInfo.name = o.name
            that.ProductInfo.pmp_brand_id = o.pmp_brand_id
            that.ProductInfo.description = o.description == null ? "" : o.description
            that.ProductInfo.on_sell = o.on_sell
              //标签
            o.pmp_product_labels.forEach((p) => {
                that.ProductInfo.pmp_product_labels.push(p.pmp_label.name)
              })
              //规格
            o.pmp_variants.forEach((z) => {
                z.pmp_specifications.forEach((e) => {
                  specifications.push(e.name)
                })
                z.pmp_variant_images.forEach((c) => {
                  images.push(c.attachment_id)
                })
                that.ProductInfo.pmp_variants.push({
                  id: z.id,
                  name: z.name,
                  on_sell:z.on_sell,
                  pmp_specifications: specifications,
                  pmp_variant_images: images
                })
              })
              //价格
            o.pmp_product_prices.forEach((b) => {
              that.PriceInfo.push({
                code: b.brand_role_code,
                price: b.price
              })
            })
          } else {
            console.log('商品读取错误')
          }
        })
        //获取代理信息，显示代理价格
      pmpProductAPI.getBrandRoles(that.ProductInfo.pmp_brand_id).then((o) => {
        if (that.PriceInfo.length > 0) {
          o.forEach((e) => {
            var setPrice = that.PriceInfo.filter(d => d.code == e.level)
            var MergePrice = setPrice[0] === undefined ? "0.00" : setPrice[0].price
            that.ProductInfo.pmp_product_prices.push({
                brand_role_name: e.name,
                brand_role_code: e.level,
                price: parseFloat(MergePrice).toFixed(2)
              })
              // that.PriceInfo.filter(z => z.code == e.level).forEach((x) => {
              //   that.ProductInfo.pmp_product_prices.push({
              //     brand_role_name: e.name,
              //     brand_role_code: e.level,
              //     price: x.price.toFixed(2)
              //   })
              // })
          })
        }
      })
    } else {
      that.currentActive = "MainPage"
    }
  }
}
</script>
<style>

</style>
