<template>
<div class="vux-demo-header-box wapmain-header" slot="header">
  <x-header :left-options="leftOptions">我的货品</x-header>
  <div slot="left" class="onclick-back" @click="headerGoBack">返回</div>
</div>
<div id="productsetting">
<div @click="openSearchComponent">
  <div class="search"><img alt="搜索按钮" src="/static/TestIMG/productSetting_search.png" /></div>
</div>
<tab>
  <tab-item :selected="tabItems.default === item.key" v-for="item in tabItems.list" @click="chooseTabItem(item.value)">{{item.key}}</tab-item>
</tab>
<div v-show="showModel.showProductContainer">
  <div v-if="showModel.showNoProduct">
    <p>没有任何商品哦~</p>
    <p>赶快去添加吧</p>
  </div>

  <div v-else>
  <div class="productsetting-li">
    <group v-for="productItem in productsData.getProducts.list">
        <div class="productsetting-list">
      <cell :title="productItem.name" @click="goToEditProduct(productItem.id)">
        <img slot="icon" width="50" :src="getProductImgHref(productItem.pmp_variants[0].pmp_variant_images[0].attachment_id)" alt="产品图片" />
      </cell>
      </div>
    </group>
    <x-button v-show="showModel.showLoadMoreBtn" @click="loadProduct">加载更多</x-button>
  </div>
  <div>

<div class="productsetting-button">  <x-button @click="addProduct">添加商品</x-button></div>
</div>
<div>
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
    chooseTabItem(item) {
      var that = this

      this.productsData.chooseTab = item
      this.showModel.showProductContainer = false
      this.productsData.page = 0

      pmpProductAPI.getProducts({
        page: this.productsData.page,
        on_sell: this.productsData.chooseTab
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

      pmpProductAPI.getProducts({
        page: this.productsData.page,
        on_sell: this.productsData.chooseTab
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
    addProduct() {
      this.$route.router.go("/productManagement/editProduct")
    },
    openSearchComponent() {
      this.$route.router.go("/productManagement/editProductSearch")
    },
    getProductImgHref(fileId) {
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

<style lang="less">
.xs-plugin-pullup-container {
    text-align: center;
}
#productsetting .search{
  position: absolute;
      top: 10px;
      right: -8px;
}
#productsetting .search img{
    width: 53%;

}
#productsetting .vux-tab .vux-tab-item{
  font-size: 4.5vw;/*14px*/
  color: #393a3f;
      line-height: 32px;
}
#productsetting .vux-tab{
  background: none;
      height: 32px;
          border-bottom: 1px solid #d3d1d1;
}
#productsetting .vux-tab .vux-tab-item.vux-tab-selected{
  border: 0!important;
  color: #393a3f!important;
}
#productsetting .vux-tab-ink-bar.vux-tab-ink-bar-transition-forward,#productsetting .vux-tab-ink-bar.vux-tab-ink-bar-transition-backward {
    display: block;
    height: 3px!important;

    width: 16%!important;
    margin: auto!important;

    background-color: #35495e!important;
}
#productsetting .productsetting-list img {
    min-height: 62px;
        width: 100%;
        border: 1px solid #d3d1d1
  }
  #productsetting  .productsetting-list .weui_cell_hd{
     width: 21%;
  }
    #productsetting  .productsetting-list  p{
      width: 91%;
margin: auto;
font-size: 4.5vw;
    }
#productsetting .productsetting-li{
    margin-top: 2%;
}
#productsetting .productsetting-list{
  background-color: #fff;
  border-top:1px solid #d3d1d1; ;
  border-bottom:1px solid #d3d1d1;
      margin-bottom: 1%;
}
#productsetting .weui_cell{
  padding: 4px 7px;
}
#productsetting .productsetting-button button.weui_btn.weui_btn_default{
  position: fixed;
bottom: 0;
color: #fff;
background: #21c36d;
    font-family: "微软雅黑";
      font-size: 5.2vw;/*17px*/
      border-radius: 0;
      border: 0

}
#productsetting .productsetting-button .weui_btn:after{
    border-radius: 0;
    border: 0;
        line-height: 2.2;

}
</style>
