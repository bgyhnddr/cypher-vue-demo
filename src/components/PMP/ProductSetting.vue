<template>
<div id="header" class="vux-demo-header-box wapmain-header" slot="header">
  <x-header :left-options="leftOptions">我的货品</x-header>
  <div slot="left" class="onclick-back" @click="headerGoBack">返回</div>
</div>
<div id="search-icon" @click="openSearchComponent">
  <img alt="搜索按钮" />
</div>
<tab id="tab">
  <tab-item :selected="tabItems.default === item.key" v-for="item in tabItems.list" @click="chooseTabItem(item.value)">{{item.key}}</tab-item>
</tab>
<div id="scrollerDiv" v-show="showModel.showProductContainer">
  <div v-if="showModel.showNoProduct">
    <p>没有任何商品哦~</p>
    <p>赶快去添加吧</p>
  </div>
  <div v-else>
    <scroller :height.sync="scrollerHeight" lock-x scrollbar-y use-pullup :pullup-status.sync="pullUpScroller.pullupStatus" @pullup:loading="loadProduct">
      <group v-for="productItem in productsData.getProducts.list">
        <cell :title="productItem.name" @click="goToEditProduct(productItem.id)">
          <img slot="icon" width="50" :src="getProductImgHref(productItem.pmp_variants[0].pmp_variant_images[0].attachment_id)" alt="产品图片" />
        </cell>
      </group>
      <div v-show="showModel.showPullUpSlot" slot="pullup" class="xs-plugin-pullup-container xs-plugin-pullup-up">
        <span v-show="pullUpScroller.pullupStatus === 'default'">{{pullUpScroller.pullupConfig.content}}</span>
        <span v-show="pullUpScroller.pullupStatus === 'down' || pullUpScroller.pullupStatus === 'up'">{{pullUpScroller.pullupConfig.upContent}}</span>
        <span v-show="pullUpScroller.pullupStatus === 'loading'">
          <span>{{pullUpScroller.pullupConfig.loadingContent}}</span>
        </span>
      </div>
    </scroller>
  </div>
</div>
<x-button id="add-button" @click="addProduct">添加商品</x-button>
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
  Tab,
  TabItem,
  Scroller,
  Alert
} from 'vux'
import pmpProductAPI from '../../api/pmp_product'

export default {
  components: {
    XHeader,
    Group,
    Cell,
    XButton,
    Tab,
    TabItem,
    Scroller,
    Alert
  },
  data() {
    return {
      leftOptions: {
        showBack: false,
        backText: null,
        preventGoBack: false
      },
      tabItems: {
        default: "全部",
        list: [{
          key: "全部",
          value: undefined
        }, {
          key: "出售商品",
          value: 1
        }, {
          key: "停售商品",
          value: 0
        }]
      },
      productsData: {
        getProducts: {
          end: null,
          list: []
        },
        page: 0,
        chooseTab: null
      },
      scrollerHeight: "0px",
      showModel: {
        showProductContainer: false,
        showNoProduct: true,
        showPullUpSlot: true,
      },
      pullUpScroller: {
        pullupStatus: 'default',
        pullupConfig: {
          content: '上拉加载更多',
          downContent: '松开进行加载',
          upContent: '上拉加载更多',
          loadingContent: '加载中...'
        }
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
    chooseTabItem(item) {
      var that = this

      this.productsData.chooseTab = item
      this.showModel.showProductContainer = false
      this.showModel.showNoProduct = true
      this.productsData.page = 0
      this.showModel.showPullUpSlot = true
      this.pullUpScroller.pullupStatus = 'default'

      pmpProductAPI.getProducts({
        page: this.productsData.page,
        on_sell: this.productsData.chooseTab
      }).then(function(result) {
        if (result.list.length == 0) {
          that.showModel.showNoProduct = true
        } else {

          that.loadScrollerHight()
          that.productsData.getProducts.end = result.end
          that.productsData.getProducts.list = result.list
          that.productsData.page = 1

          if (result.end) {
            that.showModel.showPullUpSlot = false
          }

          that.showModel.showNoProduct = false
        }
        that.showModel.showProductContainer = true
      }).catch(function(err) {
        that.alert.showCatchError = true
        that.alert.catchErrorMsg = "读取我的货品信息异常，请稍后再试"
      })

    },
    loadProduct(uuid) {
      var that = this

      pmpProductAPI.getProducts({
        page: this.productsData.page,
        on_sell: this.productsData.chooseTab
      }).then(function(result) {

        setTimeout(() => {
          if (result.end) {
            that.$broadcast('pullup:done', uuid)
          } else {
            that.$broadcast('pullup:reset', uuid)
            that.productsData.page += 1
          }

          result.list.map((o) => {
            that.productsData.getProducts.list.push(o)
          })
          that.productsData.getProducts.end = result.end
        }, 2000)

      }).catch(function(err) {
        that.alert.showCatchError = true
        that.alert.catchErrorMsg = "读取我的货品信息异常，请稍后再试"
      })
    },
    goToEditProduct(productId) {
      this.$route.router.go("/productManagement/editProduct/" + productId)
    },
    addProduct() {
      this.$route.router.go("/productManagement/editProduct")
    },
    openSearchComponent() {
      this.$route.router.go("/productManagement/editProductSearch")
    },
    getProductImgHref(fileId) {
      return '/service/public/upload/getAttachment?id=' + fileId
    },
    loadScrollerHight() {
      var clientHeight = document.documentElement.clientHeight
      var headerHeight = document.getElementById("header").offsetHeight
      var searchDivHeight = document.getElementById("search-icon").offsetHeight
      var TabHeight = document.getElementById("tab").offsetHeight
      var addButtonHeight = document.getElementById("add-button").offsetHeight

      var scrollerHight = clientHeight - (headerHeight + searchDivHeight + TabHeight + addButtonHeight)

      document.getElementById("scrollerDiv").style.height = scrollerHight + "px"
      this.scrollerHeight = scrollerHight + "px"
    },
    errorHandled() {
      this.$route.router.go("/productManagement")
    }
  },
  ready() {
    this.chooseTabItem()
  }
}
</script>

<style lang="less">
.xs-plugin-pullup-container {
    text-align: center;
}
</style>
