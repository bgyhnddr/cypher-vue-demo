<template>
<div class="vux-demo-header-box wapmain-header" slot="header">
  <x-header :left-options="leftOptions">货品关联</x-header>
  <div slot="left" class="onclick-back" @click="headerGoBack">返回</div>
</div>
<div @click="openSearchPage">
  <img alt="搜索按钮" />
</div>
<div v-show="showModel.showProductContainer">
  <div v-if="showModel.showNoProduct">
    <p>暂时没有任何货品哦~</p>
  </div>
  <div v-else>
    <group v-for="productItem in productsData.getProducts.list">
      <cell :title="productItem.name" @click="goToEditProduct(productItem.id)">
        <div>
          <label>{{$index + 1}} .</label>
        </div>
        <div>
          <label>{{productItem.pmp_variant.pmp_product.name}}</label>
          <label>{{productItem.pmp_variant.name}}</label>
          <label>{{productItem.name}}</label>
        </div>
        <x-button @click="goToProductRelatePage(productItem.id)">扫码</x-button>
        <img slot="icon" width="50" :src="getProductImgHref(productItem.pmp_variants[0].pmp_variant_images[0].attachment_id)" alt="产品图片" />
      </cell>
    </group>
    <x-button v-show="showModel.showLoadMoreBtn" @click="loadProduct">加载更多</x-button>
  </div>
</div>
<div class="all-footer">© 2016 ShareWin.me 粤ICP备14056388号</div>
<div>
  <alert :show.sync="alert.showCatchError" button-text="确认" @on-hide="errorHandled">{{alert.catchErrorMsg}}</alert>
</div>
</template>

<script>
import {
  XHeader,
  Group,
  Cell,
  XButton,
  Alert
} from 'vux'
import pmpProductAPI from '../../api/pmp_product'

export default {
  components: {
    XHeader,
    Group,
    Cell,
    XButton,
    Alert
  },
  data() {
    return {
      leftOptions: {
        showBack: false,
        backText: null,
        preventGoBack: false
      },
      productsData: {
        getProducts: {
          end: null,
          list: []
        },
        page: 0
      },
      showModel: {
        showProductContainer: false,
        showNoProduct: true,
        showLoadMoreBtn: true
      },
      alert: {
        showCatchError: false,
        catchErrorMsg: null
      }
    }
  },
  methods: {
    headerGoBack() {
      this.$route.router.go("/productManagement")
    },
    getProducts(item) {
      var that = this

      this.showModel.showProductContainer = false
      this.productsData.page = 0

      pmpProductAPI.getSpecifications({
        page: this.productsData.page
      }).then(function(result) {
        if (result.list.length == 0) {
          that.showModel.showNoProduct = true
        } else {
          that.productsData.getProducts.end = result.end
          that.productsData.getProducts.list = result.list
          that.productsData.page = 1

          if (result.end) {
            that.showModel.showLoadMoreBtn = false
          } else {
            that.showModel.showLoadMoreBtn = true
          }

          that.showModel.showNoProduct = false
        }
        that.showModel.showProductContainer = true
      }).catch(function(err) {
        that.alert.showCatchError = true
        that.alert.catchErrorMsg = "读取我的货品信息异常，请稍后再试"
      })

    },
    loadProduct() {
      var that = this
      this.showModel.showLoadMoreBtn = false

      pmpProductAPI.getSpecifications({
        page: this.productsData.page
      }).then(function(result) {
        result.list.map((o) => {
          that.productsData.getProducts.list.push(o)
        })
        that.productsData.getProducts.end = result.end

        if (result.end) {
          that.showModel.showLoadMoreBtn = false
        } else {
          that.productsData.page += 1
          that.showModel.showLoadMoreBtn = true
        }

      }).catch(function(err) {
        that.alert.showCatchError = true
        that.alert.catchErrorMsg = "读取我的货品信息异常，请稍后再试"
      })
    },
    goToProductRelatePage(productSpecificationId) {
      this.$route.router.go("/productManagement/productRelate/" + productSpecificationId)
    },
    openSearchPage() {
      this.$route.router.go("/productManagement/linkProductToQRCodeSearch")
    },
    getProductImgHref(fileId) {
      return '/service/public/upload/getAttachment?id=' + fileId
    },
    errorHandled() {
      this.$route.router.go("/productManagement")
    }
  },
  ready() {
    this.getProducts()
  }
}
</script>

<style lang="less">
.xs-plugin-pullup-container {
    text-align: center;
}
</style>
