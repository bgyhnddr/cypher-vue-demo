<template>
<div class="vux-demo-header-box wapmain-header" slot="header">
  <x-header :left-options="leftOptions">我的货品</x-header>
  <div slot="left" class="onclick-back" @click="headerGoBack">返回</div>
</div>
<div @click="openSearchComponent">
  <img alt="搜索按钮" />
</div>
<div>
  <tab>
    <tab-item :selected="tabItems.default === item.key" v-for="item in tabItems.list" @click="chooseTabItem(item.value)">{{item.key}}</tab-item>
  </tab>
  <div v-if="showModel.showProductContainer">
    <div v-if="showModel.showNoProduct">
      <p>没有任何商品哦~</p>
      <p>赶快去添加吧</p>
    </div>
    <div v-else>
      <scroller lock-x scrollbar-y use-pullup :pullup-config="pullUpScroller.pullupConfig" height="280px" @pullup:loading="loadProduct">
        <div>
          <group v-for="productItem in productsData.getProducts.list">
            <a class="weui_cell" v-link="{path: '/productManagement/editProduct/'+ productItem.id}">
              <div class="weui_cell_hd">
                <img :src="getProductImgHref(productItem.pmp_variants[0].pmp_variant_images[0].attachment_id)" width="50px" height="50px" alt="产品图片">
              </div>
              <div class="weui_cell_bd weui_cell_primary">
                <p>{{productItem.name}}</p>
                <p>￥ </p>
              </div>
            </a>
          </group>
        </div>
      </scroller>
    </div>
  </div>
  <div>
    <x-button @click="addProduct">添加商品</x-button>
    <alert :show.sync="alert.showCatchError" button-text="确认" @on-hide="errorHandled">{{alert.catchErrorMsg}}</alert>
  </div>
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
      showModel: {
        showProductContainer: false,
        showNoProduct: true
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
      that.showModel.showProductContainer = false

      pmpProductAPI.getProducts({
        page: 0,
        on_sell: this.productsData.chooseTab
      }).then(function(result) {
        if (result.list.length == 0) {
          that.showModel.showNoProduct = true
        } else {
          that.productsData.getProducts.end = result.end
          that.productsData.getProducts.list = result.list
          that.productsData.page = 1

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
          if (result.list.length == 0) {
            that.$broadcast('pullup:done', uuid)
          } else {
            setTimeout(() => {
              that.$broadcast('pullup:reset', uuid)

              result.list.map((o) => {
                that.productsData.getProducts.list.push(o)
              })
              that.productsData.getProducts.end = result.end
              that.productsData.page += 1

            }, 10)
          }
        }, 2000)

      }).catch(function(err) {
        that.alert.showCatchError = true
        that.alert.catchErrorMsg = "读取我的货品信息异常，请稍后再试"
      })
    },
    addProduct() {
      this.$route.router.go("/productManagement/editProduct")
    },
    openSearchComponent() {
      this.$route.router.go("/productManagement/editProductSearch")
    },
    getProductImgHref(fileId){
      return '/service/public/upload/getAttachment?id=' + fileId
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
