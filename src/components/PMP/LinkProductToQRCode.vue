<template>
<div class="vux-demo-header-box wapmain-header" slot="header">
  <x-header :left-options="leftOptions">货品关联</x-header>
  <div slot="left" class="onclick-back" @click="headerGoBack">返回</div>

  <div @click="openSearchPage" class="linkProductToQRCode-Search">
    <img alt="搜索按钮" src="/static/TestIMG/productSetting_search.png" />
  </div>
</div>

<div v-show="showModel.showProductContainer">
  <div id="linkProductToQRCode">
    <div v-if="showModel.showNoProduct" class="linkProductToQRCode-none">
      <p>暂时没有任何货品哦~</p>

    </div>
    <div v-else>
      <group v-for="productItem in productsData.getProducts.list">
        <div class="linkProductToQRCode-list">

          <div class="linkProductToQRCode-number">{{$index + 1}} .</div>

          <div class="linkProductToQRCode-img">
            <img slot="icon" width="50" :src="getProductImgHref(productItem.pmp_variant.pmp_variant_images[0].attachment_id)" alt="产品图片" />
          </div>

          <div class="linkProductToQRCode-main">
            <cell :title="productItem.pmp_variant.pmp_product.name"></cell>

            <div class="text-wrapper">{{productItem.pmp_variant.name}}
              <span>{{productItem.name}}</span>
            </div>
          </div>
          <div class="linkProductToQRCode-button">
            <x-button @click="goToProductRelatePage(productItem.id)">扫码</x-button>
          </div>
          <p class="clean"></p>
        </div>

      </group>
      <x-button v-show="showModel.showLoadMoreBtn" @click="loadProduct" class="more">点击可加载更多内容</x-button>
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

    this.getPersonalInfo()
    document.body.style.background = '#f2f2f2'

  }
}
</script>

<style lang="less">
.xs-plugin-pullup-container {
    text-align: center;
}
.linkProductToQRCode-Search {
    position: absolute;
    top: 10px;
    right: -8px;
}
.linkProductToQRCode-Search img {
    width: 53%;
}
#linkProductToQRCode {
    min-height: 478px;
    padding-top: 46px;
}
#linkProductToQRCode .weui_cells.vux-no-group-title {

    background-color: #fff;
    border-top: 1px solid #d3d1d1;
    border-bottom: 1px solid #d3d1d1;
    margin-bottom: 1%;

}
#linkProductToQRCode .weui_cell_hd {
    width: auto;
}
#linkProductToQRCode .linkProductToQRCode-list {
    padding: 2% 0;
    position: relative;
}
#linkProductToQRCode .linkProductToQRCode-list > div {
    float: left;

}
#linkProductToQRCode .linkProductToQRCode-list .linkProductToQRCode-number {
    width: 10%;
    text-align: center;
    padding: 8% 0;
    font-size: 4.5vw;
    border-right: 1px solid #d3d1d1;
    margin-right: 2%;

}
#linkProductToQRCode .linkProductToQRCode-list .linkProductToQRCode-img {
    float: left;
    width: 21%;
    padding-top: 21%;
    position: relative;
    display: block;
    overflow: hidden;
    border: 1px solid #d3d1d1;

}
#linkProductToQRCode .linkProductToQRCode-list .linkProductToQRCode-img img {
    left: 0;
    top: 0;
    width: 100%;
    position: absolute;
    vertical-align: middle;
    min-height: 77px;
}

#linkProductToQRCode .linkProductToQRCode-list .linkProductToQRCode-main {
    padding: 0 3%;
    font-size: 4.5vw;
    width: 40%;
    font-family: "微软雅黑";

}
#linkProductToQRCode .linkProductToQRCode-list .linkProductToQRCode-main p {
    min-height: 31px;
    color: #393a3f;
    font-size: 4.1vw;
    display: box;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
#linkProductToQRCode .linkProductToQRCode-list .linkProductToQRCode-main .text-wrapper {
    font-size: 4.5vw;
    color: #878787;
    position: absolute;
    bottom: 12%;
    width: 45%;
    font-family: "微软雅黑";

}
#linkProductToQRCode .linkProductToQRCode-list .linkProductToQRCode-main .text-wrapper span {
    margin-left: 10px;
}
#linkProductToQRCode .linkProductToQRCode-list .linkProductToQRCode-main .weui_cell {

    position: absolute;
    top: 8%;
    padding: 0;
    width: 45%;
}
#linkProductToQRCode .linkProductToQRCode-list .linkProductToQRCode-button {
    float: right;
    float: right;
    padding: 5% 0;
    border-left: 1px solid #d3d1d1;
}
#linkProductToQRCode .linkProductToQRCode-list .linkProductToQRCode-button button.weui_btn.weui_btn_default {
    background: #fff;
    border: 0;
    font-size: 4.7vw;
    color: #21c36d;
    font-family: "微软雅黑";
}
#linkProductToQRCode .weui_btn:after {
    border: 0;
}
#linkProductToQRCode .linkProductToQRCode-none {
    text-align: center;
    color: #a1a1a1;
    font-size: 5.3vw;
    margin-top: 52%;
    font-family: "微软雅黑";
}
</style>
