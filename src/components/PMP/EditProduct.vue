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
      <cell title="" is-link v-for="item in ProductInfo.pmp_variants" @click="showSpecificationPage(item.name)">
        <div slot="icon">
          <span>{{item.name}}</span>
        </div>
        <div slot="after-title">
          <span v-for="size in item.pmp_specifications">
            <span v-if="size.on_sell">{{size.name}}
              <span>
              </span>
        </div>
        <span v-if="item.on_sell==false">已下架</span>
      </cell>
      <div class="weui_cell" v-if="!BtnFlag" @click="showSpecificationPage()">
        <x-button plain>添加商品规格</x-button>
      </div>
    </group>
    <div>
      <x-button plain @click="showSubmit">{{BtnMsg}}商品</x-button>
    </div>
  </div>
  <confirm :show.sync="showConfirm" title="" confirm-text="确认" cancel-text="取消" @on-confirm="submitProduct">
    <p style="text-align:center;">您确认{{BtnMsg}}该商品吗?</p>
  </confirm>
  <alert :show.sync="showAlert" button-Text="好的">{{alertMsg}}</alert>
  <!-- 子组件页 -->
  <div>
    <set-product-price v-if="currentActive=='SetPricePage'" :current-active.sync="currentActive" :product-info.sync="ProductInfo"></set-product-price>
    <product-operate v-if="currentActive=='OperatePage'" :current-active.sync="currentActive" :product-info.sync="ProductInfo"></product-operate>
    <edit-product-label v-if="currentActive=='EditLabelPage'" :current-active.sync="currentActive" :product-info.sync="ProductInfo"></edit-product-label>
    <edit-product-specification v-if="currentActive=='EditSpecificationPage'" :current-active.sync="currentActive" :choose-specification.sync="chooseSpecification" :product-info.sync="ProductInfo">
      <edit-product-specification>
  </div>
</div>
</template>

<script>
import {
  Group,
  Cell,
  Confirm,
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
import EditProductSpecification from './EditProductSpecification'

export default {
  components: {
    Group,
    Cell,
    Confirm,
    Alert,
    XHeader,
    XInput,
    XButton,
    XTextarea,
    SetProductPrice,
    ProductOperate,
    EditProductLabel,
    EditProductSpecification,
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
      PriceInfo: [],
      chooseSpecification: null,
      alertMsg: "",
      BtnMsg: "",
      showAlert: false,
      showConfirm: false
    }
  },
  methods: {
    valid() {
      return this.ProductInfo.name && this.ProductInfo.pmp_product_prices.length > 0
    },
    onClickBack() {
      this.$route.router.go('/productManagement/productSetting')
    },
    showSetPricePage() {
      this.currentActive = "SetPricePage"
    },
    showEditLabelPage() {
      this.currentActive = "EditLabelPage"
    },
    showSpecificationPage(e) {
      if (e == null) {
        this.chooseSpecification = null
      } else {
        this.chooseSpecification = e
      }
      this.currentActive = "EditSpecificationPage"
    },
    showSubmit() {
      var that = this
      if (that.valid()) {
        that.showConfirm = true
      } else {
        if (!that.ProductInfo.name) {
          that.alertMsg = "请输入商品名称"
        } else if (that.ProductInfo.pmp_product_prices.length == 0) {
          that.alertMsg = "请设置商品价格"
        }
        that.showAlert = true
      }
    },
    submitProduct() {
      var that = this
      var id = that.$route.params.id
      var Info = that.ProductInfo
      console.log(JSON.stringify(that.ProductInfo.pmp_variants))
      pmpProductAPI.submitProduct({
          id: id,
          name: Info.name,
          on_sell: Info.on_sell == null ? true : Info.on_sell,
          description: Info.description,
          pmp_variants: Info.pmp_variants,
          pmp_product_labels: Info.pmp_product_labels.map(c => c = {
            pmp_label: {
              name: c
            }
          }),
          pmp_product_prices: Info.pmp_product_prices
        }).then(() => {
          if (id) {
            that.alertMsg = "商品已保存"
            that.showAlert = true
          } else {
            that.$route.router.go('/productManagement/productSetting')
          }
        })
    }
  },
  ready() {
    var that = this
    var id = that.$route.params.id
    if (id) {
      that.BtnMsg = "保存"
      that.currentActive = "OperatePage"
      pmpProductAPI.getProduct({
        id: id
      }).then((o) => {
        if (o) {
          console.log(o)
          that.ProductInfo.name = o.name
          that.ProductInfo.description = o.description == null ? "" : o.description
          that.ProductInfo.on_sell = o.on_sell
            //标签
          o.pmp_product_labels.forEach((p) => {
              that.ProductInfo.pmp_product_labels.push(p.pmp_label.name)
            })
            //规格
          o.pmp_variants.forEach((z) => {
              var specifications = []
              var images = []
              z.pmp_specifications.forEach((e) => {
                specifications.push({
                  id: e.id,
                  name: e.name,
                  on_sell: e.on_sell
                })
              })
              z.pmp_variant_images.forEach((c) => {
                images.push({
                  id: c.id,
                  attachment_id: c.attachment_id
                })
              })
              that.ProductInfo.pmp_variants.push({
                id: z.id,
                name: z.name,
                on_sell: z.on_sell,
                pmp_specifications: specifications,
                pmp_variant_images: images
              })
            })
            //价格
          o.pmp_product_prices.forEach((b) => {
            that.PriceInfo.push({
              id: b.id,
              code: b.brand_role_code,
              price: b.price
            })
          })
          console.log(JSON.stringify(that.ProductInfo.pmp_variants))
        } else {
          console.log('商品读取错误')
        }
      })

      //获取代理信息，显示代理价格
      pmpProductAPI.getBrandRoles().then((o) => {
        if (that.PriceInfo.length > 0) {
          o.forEach((e) => {
            var setPrice = that.PriceInfo.filter(d => d.code == e.level)
            var PriceID = setPrice[0] === undefined ? "" : setPrice[0].id
            var MergePrice = setPrice[0] === undefined ? "0.00" : setPrice[0].price
            that.ProductInfo.pmp_product_prices.push({
              id: PriceID,
              brand_role_name: e.name,
              brand_role_code: e.level,
              price: parseFloat(MergePrice).toFixed(2),
              price_unit: "RMB"
            })
          })
        }
      })
    } else {
      that.BtnMsg = "加入"
      that.currentActive = "MainPage"
    }
  }
}
</script>
<style>

</style>
