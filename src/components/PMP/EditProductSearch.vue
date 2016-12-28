<template>
<div class="vux-demo-header-box wapmain-header" slot="header">
  <x-header :left-options="leftOptions"></x-header>
  <div slot="left" class="onclick-back" @click="headerGoBack">返回</div>
</div>
<group>
  <x-input class="weui_cell_primary" title='' placeholder="输入搜索商品名称" :value.sync="keyword" :show-clear=false :required="false"></x-input>
  <button @click="search">搜索</button>
</group>
<div v-if="showModel.showSearchProductModel">
  <group v-for="productItem in productsData.getProducts.list">
    <cell :title="productItem.name" @click="goToEditProduct(productItem.id)">
      <img slot="icon" width="50" :src="getProductImgHref(productItem.pmp_variants[0].pmp_variant_images[0].attachment_id)" width="50px" height="50px" alt="产品图片" />
    </cell>
  </group>
  <x-button v-show="showModel.showLoadMoreBtn" @click="loadProduct">加载更多</x-button>
</div>
<div class="all-footer">© 2016 ShareWin.me 粤ICP备14056388号</div>
<div>
  <alert :show.sync="alert.showCatchError" button-text="确认" @on-hide="errorHandled">{{catchErrorMsg}}</alert>
  <alert :show.sync="alert.showErrorNoHandled" button-text="确认">{{alert.errorMsgNoHandled}}</alert>
</div>
</template>

<script>
import {
  XHeader,
  Group,
  Cell,
  XInput,
  XButton,
  Alert
} from 'vux'
import pmpProductAPI from '../../api/pmp_product'

export default {
  components: {
    XHeader,
    Group,
    Cell,
    XInput,
    XButton,
    Alert
  },
  watch: {
    'keyword' () {
      this.showModel.showSearchProductModel = false
    },
  },
  data() {
    return {
      leftOptions: {
        showBack: false,
        backText: null,
        preventGoBack: false
      },
      showModel: {
        showSearchProductModel: false,
        showLoadMoreBtn: false
      },
      keyword: null,
      productsData: {
        getProducts: {
          end: null,
          list: []
        },
        page: 0
      },
      alert: {
        showCatchError: false,
        catchErrorMsg: null,
        showErrorNoHandled: false,
        errorMsgNoHandled: null,
      }
    }
  },
  methods: {
    headerGoBack() {
      this.$route.router.go("/productManagement/productSetting")
    },
    search() {
      var that = this

      if (this.keyword == null || this.keyword.trim() == "") {
        this.alert.showErrorNoHandled = true
        this.alert.errorMsgNoHandled = "请输入需要搜索的关键字"
      } else {
        pmpProductAPI.getProducts({
          filterKey: this.keyword.trim()
        }).then(function(result) {
          if (result.list.length == 0) {
            that.keyword = null

            that.alert.showErrorNoHandled = true
            that.alert.errorMsgNoHandled = "无此商品"
          } else {
            that.productsData.getProducts.end = result.end
            that.productsData.getProducts.list = result.list
            that.productsData.page = 1

            if (result.end) {
              that.showModel.showLoadMoreBtn = false
            } else {
              that.showModel.showLoadMoreBtn = true
            }

            that.showModel.showSearchProductModel = true
          }
        }).catch(function(err) {
          that.alert.showCatchError = true
          that.alert.catchErrorMsg = "搜索货品异常，请稍后再试"
        })
      }
    },
    loadProduct() {
      var that = this
      pmpProductAPI.getProducts({
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
    goToEditProduct(productId) {
      this.$route.router.go("/productManagement/editProduct/" + productId)
    },
    getProductImgHref(fileId) {
      return '/service/public/upload/getAttachment?id=' + fileId
    },
    errorHandled() {
      this.$route.router.go("/productManagement/productSetting")
    }
  }
}
</script>
