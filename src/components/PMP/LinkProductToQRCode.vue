<template>
<div class="vux-demo-header-box wapmain-header" slot="header">
  <x-header :left-options="leftOptions">货品关联</x-header>
  <div slot="left" class="onclick-back" @click="headerGoBack">返回</div>

  <div @click="openSearchPage"  class="linkProductToQRCode-Search">
    <img alt="搜索按钮"  src="/static/TestIMG/productSetting_search.png"/>
  </div>
</div>

<div v-show="showModel.showProductContainer">
  <div id="linkProductToQRCode">
  <div v-if="showModel.showNoProduct">
    <p>暂时没有任何货品哦~</p>
  </div>
  <div v-else >
    <group v-for="productItem in productsData.getProducts.list">
      <div class="linkProductToQRCode-list">

          <div class="linkProductToQRCode-number">{{$index + 1}} .</div>

      <div class="linkProductToQRCode-img">  <img slot="icon" width="50" :src="getProductImgHref(productItem.pmp_variant.pmp_variant_images[0].attachment_id)" alt="产品图片" /></div>

<div class="linkProductToQRCode-main">
      <cell :title="productItem.pmp_variant.pmp_product.name"></cell>

          <label>{{productItem.pmp_variant.name}}<span>{{productItem.name}}</span></label>
        </div>
      <div class="linkProductToQRCode-button">  <x-button @click="goToProductRelatePage(productItem.id)">扫码</x-button></div>
<div class="clean"></div>
    </div>

    </group>
    <x-button v-show="showModel.showLoadMoreBtn" @click="loadProduct">加载更多</x-button>
  </div>
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
.linkProductToQRCode-Search{
  position: absolute;
  top: 10px;
  right: -8px;
}
.linkProductToQRCode-Search img {
    width: 53%;
}

#linkProductToQRCode .weui_cells.vux-no-group-title{

  background-color: #fff;
  border-top: 1px solid #d3d1d1;
  border-bottom: 1px solid #d3d1d1;
  margin-bottom: 1%;
}
#linkProductToQRCode .weui_cell_hd{
  width: auto;
}
#linkProductToQRCode .linkProductToQRCode-list{
  padding: 2% 0
}
#linkProductToQRCode .linkProductToQRCode-list>div{
  float: left;


}
#linkProductToQRCode .linkProductToQRCode-list .linkProductToQRCode-number{
width: 10%;
text-align: center;
padding:8% 0;
font-size: 4.5vw
}
#linkProductToQRCode .linkProductToQRCode-list .linkProductToQRCode-img {
      width: 21%;

}
#linkProductToQRCode .linkProductToQRCode-list .linkProductToQRCode-img img{
  min-height: 62px;
width: 100%;
border: 1px solid #d3d1d1;
}

#linkProductToQRCode .linkProductToQRCode-list .linkProductToQRCode-main{
  padding: 0% 2%;
  font-size: 4.5vw;
  width: 40%;
  font-family: "微软雅黑";


}
#linkProductToQRCode .linkProductToQRCode-list .linkProductToQRCode-main p{
  min-height: 31px;
  color: #393a3f;
  font-size: 4.1vw
}
#linkProductToQRCode .linkProductToQRCode-list .linkProductToQRCode-main label{
  font-size: 4.5vw;
  color: #878787;

}
#linkProductToQRCode .linkProductToQRCode-list .linkProductToQRCode-main label span{
  margin-left: 10px
}
#linkProductToQRCode .linkProductToQRCode-list .linkProductToQRCode-main .weui_cell{
   padding: 0
}
#linkProductToQRCode .linkProductToQRCode-list .linkProductToQRCode-button{
  float: right;
  float: right;
padding: 5% 0;
border-left: 1px solid #d3d1d1;
}
#linkProductToQRCode
 .linkProductToQRCode-list
 .linkProductToQRCode-button
button.weui_btn.weui_btn_default {
    background: #fff;
    border: 0;
    font-size: 4.7vw;
    color: #21c36d;
    font-family: "微软雅黑";
}
#linkProductToQRCode .weui_btn:after{
  border: 0
}
</style>
