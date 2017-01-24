<template>
<div class="vux-demo-header-box wapmain-header" slot="header">
  <x-header :left-options="leftOptions"></x-header>
  <div slot="left" class="onclick-back" @click="headerGoBack">返回</div>
</div>
<div id="linkProductToQRCodeSearch">
    <div class="linkProductToQRCodeSearch-search">
<group>
  <x-input class="weui_cell_primary" title='' placeholder="搜索商品名称" :value.sync="keyword" :show-clear=false :required="false"></x-input>
  <button @click="search"></button>
</group>
</div>
<div v-if="showModel.showSearchProductModel">
  <group v-for="productItem in productsData.getProducts.list">
      <div class="linkProductToQRCodeSearch-list">
                  <div class="linkProductToQRCodeSearch-number">{{$index + 1}} .</div>
                  <div class="linkProductToQRCodeSearch-img" >
                      <img slot="icon" width="50" :src="getProductImgHref(productItem.pmp_variant.pmp_variant_images[0].attachment_id)" alt="产品图片" />
                  </div>
                  <div class="linkProductToQRCodeSearch-main">
                    <cell :title="productItem.pmp_variant.pmp_product.name">  </cell>
                    <div class="text-wrapper">{{productItem.pmp_variant.name}}<span>{{productItem.name}}</span></div>
                </div>

                  <div class="linkProductToQRCodeSearch-button">     <x-button @click="goToProductRelatePage(productItem.id)">扫码</x-button></div>
                <p class="clean"></p>



  </div>
  </group>
  <x-button v-show="showModel.showLoadMoreBtn" @click="loadProduct"  class="more">点击可加载更多内容</x-button>
</div>

<div>
  <alert :show.sync="alert.showCatchError" button-text="确认" @on-hide="errorHandled">{{catchErrorMsg}}</alert>
  <alert :show.sync="alert.showErrorNoHandled" button-text="确认">{{alert.errorMsgNoHandled}}</alert>
</div>
</div>
<div class="all-footer">© 2016 ShareWin.me 粤ICP备14056388号</div>
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
      this.$route.router.go("/productManagement/linkProductToQRCode")
    },
    search() {
      var that = this

      if (this.keyword == null || this.keyword.trim() == "") {
        this.alert.showErrorNoHandled = true
        this.alert.errorMsgNoHandled = "请输入需要搜索的关键字"
      } else {
        pmpProductAPI.getSpecifications({
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
      pmpProductAPI.getSpecifications({
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
    goToProductRelatePage(productSpecificationId) {
      this.$route.router.go("/productManagement/productRelate/" + productSpecificationId)
    },
    getProductImgHref(fileId) {
      return '/service/public/upload/getAttachment?id=' + fileId
    },
    errorHandled() {
      this.$route.router.go("/productManagement/productSetting")
    }
  }
  ,
  ready() {

      document.body.style.background = '#f2f2f2'
  }
}
</script>
<style>
#linkProductToQRCodeSearch{
    min-height: 473px;
    padding-top: 46px
}
 #linkProductToQRCodeSearch .weui_cell{
  padding: 0
}
 #linkProductToQRCodeSearch .weui_cell_hd{
  width: auto;
}
#linkProductToQRCodeSearch .linkProductToQRCodeSearch-search{
  width: 95%;
  margin: 5px auto;
  background: #fff;
  position: relative;
  border-left: 1px solid #d3d1d1;
  border-right: 1px solid #d3d1d1;
}
#linkProductToQRCodeSearch .linkProductToQRCodeSearch-search .weui_cell_hd{
  width: auto;
}
#linkProductToQRCodeSearch .linkProductToQRCodeSearch-search  .weui_cell.weui_cell_primary{
  padding: 0
}
#linkProductToQRCodeSearch .linkProductToQRCodeSearch-search .weui_input{

  font-size: 4.5vw;
      font-family: "微软雅黑";

          line-height: 2.5em;
          height: auto;
          width: 100%;
          padding-left: 2%

}
#linkProductToQRCodeSearch .linkProductToQRCodeSearch-search button {
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
#linkProductToQRCodeSearch  .linkProductToQRCodeSearch-list>div{
  float: left;


}
#linkProductToQRCodeSearch .linkProductToQRCodeSearch-list{
  padding: 2% 0;
position: relative;
}

#linkProductToQRCodeSearch .weui_cells.vux-no-group-title {
    background-color: #fff;
    border-top: 1px solid #d3d1d1;
    border-bottom: 1px solid #d3d1d1;
    margin-bottom: 1%;
}
#linkProductToQRCodeSearch .linkProductToQRCodeSearch-list .linkProductToQRCodeSearch-number{
  width: 10%;
    text-align: center;
    padding: 8% 0;
    font-size: 4.5vw;
    border-right: 1px solid #d3d1d1;
    margin-right: 2%;

}
#linkProductToQRCodeSearch .linkProductToQRCodeSearch-list  .linkProductToQRCodeSearch-img {
    float: left;
    width: 21%;
    padding-top: 21%;
    position: relative;
    display: block;
    overflow: hidden;
    border: 1px solid #d3d1d1;}
    #linkProductToQRCodeSearch .linkProductToQRCodeSearch-list  .linkProductToQRCodeSearch-img img {
    left: 0;
    top: 0;
    width: 100%;
    position: absolute;
    vertical-align: middle;
    min-height: 77px;
}
    #linkProductToQRCodeSearch .linkProductToQRCodeSearch-list .linkProductToQRCodeSearch-main {
    padding: 0% 2%;
    font-size: 4.5vw;
    width: 40%;
    font-family: "微软雅黑";
}
    #linkProductToQRCodeSearch .linkProductToQRCodeSearch-list .linkProductToQRCodeSearch-main p{
      min-height: 31px;
    color: #393a3f;
    font-size: 4.1vw;
    display: box;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    font-family: "微软雅黑";
}
  #linkProductToQRCodeSearch .linkProductToQRCodeSearch-list .linkProductToQRCodeSearch-main p span{
  margin-left: 10px
}
    #linkProductToQRCodeSearch .linkProductToQRCodeSearch-list .linkProductToQRCodeSearch-main .text-wrapper{
      font-size: 4.5vw;
    color: #878787;
    position: absolute;
    bottom: 12%;
    width: 45%;
        font-family: "微软雅黑";
}
    #linkProductToQRCodeSearch .linkProductToQRCodeSearch-list .linkProductToQRCodeSearch-button {
    float: right;
    padding: 5% 0;
    border-left: 1px solid #d3d1d1;
}
    #linkProductToQRCodeSearch .linkProductToQRCodeSearch-list .linkProductToQRCodeSearch-button
button.weui_btn.weui_btn_default {
    background: #fff;
    border: 0;
    font-size: 4.7vw;
    color: #21c36d;
    font-family: "微软雅黑";
}
  #linkProductToQRCodeSearch  .weui_btn:after{
  border: 0
}
</style>
