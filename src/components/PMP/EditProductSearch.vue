<template>
<div class="vux-demo-header-box wapmain-header" slot="header">
  <x-header :left-options="leftOptions"></x-header>
  <div slot="left" class="onclick-back" @click="headerGoBack">返回</div>
</div>
<div id="editProductsearch">
  <div class="editProductsearch-search">
<group>
  <x-input class="weui_cell_primary" title='' placeholder="搜索商品名称" :value.sync="keyword" :show-clear=false :required="false"></x-input>
  <button @click="search"></button>
</group>
</div>
<div class="editProductsearch-list">
<div v-if="showModel.showSearchProductModel" >
  <div class="editProductsearch-list-li">
  <group v-for="productItem in productsData.getProducts.list">
    <cell :title="productItem.name" @click="goToEditProduct(productItem.id)">
      <img slot="icon" width="50" :src="getProductImgHref(productItem)" width="50px" height="50px" alt="产品图片" />
    </cell>
  </group>
</div>
  <x-button v-show="showModel.showLoadMoreBtn" @click="loadProduct" class="more">点击可加载更多内容</x-button>
</div>
</div>
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
        this.alert.errorMsgNoHandled = "请输入需要搜索的关键词"
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
        page: this.productsData.page,
        filterKey: this.keyword.trim()
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
    getProductImgHref(productItem) {
      var fileUrl = null

      if (productItem.pmp_variants.length > 0 && productItem.pmp_variants[0].pmp_variant_images.length > 0) {
        fileUrl = '/service/public/upload/getAttachment?id=' + productItem.pmp_variants[0].pmp_variant_images[0].attachment_id
      } else {
        fileUrl = '/static/TestIMG/defaultImg.png'
      }

      return fileUrl
    },
    errorHandled() {
      this.$route.router.go("/productManagement/productSetting")
    }
  },ready(){
      document.body.style.background = '#f2f2f2'
  }
}
</script>
<style>
#editProductsearch{
    min-height: 473px;
    padding-top: 46px
}
#editProductsearch .editProductsearch-search{
  width: 95%;
      margin: 1% auto;
        border: 1px solid #d3d1d1;
          background: #fff;
          position: relative;
}
#editProductsearch .editProductsearch-search .weui_cell_hd{
  width: auto;
}
#editProductsearch .editProductsearch-search  .weui_cell.weui_cell_primary{
  padding: 0
}
#editProductsearch .editProductsearch-search .weui_input{

  font-size: 4.5vw;
      font-family: "微软雅黑";

          line-height: 2.5em;
          height: auto;
          width: 100%;
          padding-left: 2%

}
#editProductsearch .editProductsearch-search button {
  position: absolute;
  top: 11%;
  right: -6%;
  background: url(/static/TestIMG/search.png);
  background-repeat: no-repeat;
  border: 0;
  background-size: 57%;
  color: #fff;
  width: 16%;
  min-height: 30px;
  z-index: 1000;
}
#editProductsearch .editProductsearch-list .editProductsearch-list-li>div{
background: #fff;
border-top: 1px solid #d3d1d1;
border-bottom: 1px solid #d3d1d1;
margin-bottom: 1%;
}
#editProductsearch .editProductsearch-list .weui_cell_hd{
    width: 21%;
}
#editProductsearch .editProductsearch-list .editProductsearch-list-li>div img {
    min-height: 62px;
    width: 100%;
    border: 1px solid #d3d1d1;
}
#editProductsearch .editProductsearch-list .weui_cell {
    padding: 4px 7px;
}
#editProductsearch .editProductsearch-list p {
    width: 91%;
    margin: auto;
    font-size: 4.5vw;
}
</style>
