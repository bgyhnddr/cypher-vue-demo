<template>
<div class="vux-demo-header-box wapmain-header" slot="header">
  <x-header :left-options="leftOptions">货品关联</x-header>
  <div slot="left" class="onclick-back" @click="headerGoBack">返回</div>
</div>
<div @click="openSearchPage">
  <img alt="搜索按钮" />
</div>
<div>
  <div v-if="showModel.showProductContainer">
    <div v-if="showModel.showNoProduct">
      <p>暂时没有任何货品哦~</p>
    </div>
    <div v-else>
      <scroller lock-x scrollbar-y use-pullup :pullup-status.sync="pullUpScroller.pullupStatus" @pullup:loading="loadProduct">
        <div v-for="productItem in productsData.getProducts.list">
          <div>
            <label>{{$index + 1}} .</label>
          </div>
          <img slot="icon" width="50" :src="getProductImgHref(productItem.pmp_variant.pmp_variant_images[0].attachment_id)" alt="产品图片" />
          <div>
            <label>{{productItem.pmp_variant.pmp_product.name}}</label>
            <label>{{productItem.pmp_variant.name}}</label>
            <label>{{productItem.name}}</label>
          </div>
          <x-button @click="runWxScanQRCode(productItem)">扫码</x-button>
        </div>
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
  <div>
    <confirm :show.sync="alert.showComfirm" title="" confirm-text="否" cancel-text="是" @on-cancel="showProductLinkedDetailPage">
      <p style="text-align:center;">是否将箱 {{alert.comfirmMsg}}
        <label>(规格)</label> 里？</p>
    </confirm>
    <alert :show.sync="alert.showCatchError" button-text="确认" @on-hide="errorHandled">{{alert.catchErrorMsg}}</alert>
    <alert :show.sync="alert.showErrorNoHandled" button-text="确认">{{alert.errorMsgNoHandled}}</alert>
  </div>
</div>
</template>

<script>
import {
  XHeader,
  XButton,
  Scroller,
  Alert,
  Confirm
} from 'vux'
import pmpProductAPI from '../../api/pmp_product'

export default {
  components: {
    XHeader,
    XButton,
    Scroller,
    Alert,
    Confirm
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
        page: 0,
        chooseTab: 1,
        chooseProduct: null
      },
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
        catchErrorMsg: null,
        showComfirm: false,
        comfirmMsg: null,
        showErrorNoHandled: false,
        errorMsgNoHandled: null
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
      this.showModel.showPullUpSlot = true
      this.pullUpScroller.pullupStatus = 'default'

      pmpProductAPI.getSpecifications({
        page: this.productsData.page,
        count: 2,
        on_sell: this.productsData.chooseTab
      }).then(function(result) {
        if (result.list.length == 0) {
          that.showModel.showNoProduct = true
        } else {
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

      pmpProductAPI.getSpecifications({
        page: this.productsData.page,
        count: 2,
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
    runWxScanQRCode(productItem) {
      console.log("扫码")

      var boxCode = ""
      this.linkToQRCode(boxCode, productItem)
    },
    linkToQRCode(boxCode, productItem) {
      var checkFlag = this.checkBoxCode(boxCode)
      if (checkFlag) {
        this.alert.showComfirm = true
        this.alert.comfirmMsg = boxCode + " 关联到" + productItem.pmp_variant.pmp_product.name +
          " " + productItem.pmp_variant.name + " " + productItem.name
        this.productsData.chooseProduct = productItem
      } else {
        alert.showErrorNoHandled = true
        alert.errorMsgNoHandled = "扫码结果错误，请重新再扫一次"
      }
    },
    checkBoxCode(boxCode) {
      return true
    },
    openSearchPage() {
      this.$route.router.go("/productManagement/linkProductToQRCodeSearch")
    },
    showProductLinkedDetailPage() {
      console.log(JSON.stringify(this.productsData.chooseProduct))
      // this.$route.router.go("/productManagement/linkProductToQRCodeSearch")
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
