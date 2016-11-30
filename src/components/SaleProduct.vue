<template>
<div>
  <!-- 未出售 -->
  <div v-if="showUnsoldModel">
    <p class="brand-logo-bili">
      <img class="vux-x-img ximg-demo" src="/static/TestIMG/logo.png" alt="品牌logo" />
    </p>
    <group>
      <cell title="货品 ：" :value.sync="unsoldProductInfo.name"></cell>
      <cell title="货号 ：" :value.sync="unsoldProductInfo.productID"></cell>
      <cell title="零售价 ：￥" :value.sync="unsoldProductInfo.retailPrice"></cell>
      <cell title="状态 ：" :value.sync="unsoldProductInfo.status"></cell>
    </group>
    <div>
      <p>提示：</p>
      <p>1.请核对货品信息，无误后点击出售</p>
      <p>2.全国统一客服电话：{{brandInfo.servicesPhone}}</p>
      <p>3.货品最终解释权归{{brandInfo.brandName}}所有</p>
    </div>
    <div>© 2016 ShareWin.me 粤ICP备14056388号</div>
    <x-button type="primary" @click="showComfirm=true">出售此货品</x-button>
  </div>
  <!--出售按钮二次确认-->
  <confirm :show.sync="showComfirm" title="" confirm-text="确认" cancel-text="取消" @on-confirm="saleProduct">
    <p style="text-align:center;">确定出售此商品吗？</p>
  </confirm>
  <!--出售成功下一步操作-->
  <confirm :show.sync="showSuccessNextStep" title="" confirm-text="继续扫码" cancel-text="返回" @on-confirm="runWxScanQRCode" @on-cancel="goToHomePage">
    <p style="text-align:center;">请进行下一步操作？</p>
  </confirm>
  <!--非owner查看出售-->
  <confirm :show.sync="showUnableToSale" title="" confirm-text="继续扫码" cancel-text="返回" @on-confirm="runWxScanQRCode" @on-cancel="goToHomePage">
    <p style="text-align:center;">您无权查看此货品</p>
  </confirm>
  <!-- 已出售 -->
  <div v-if="showSoldModel">
    <p class="brand-logo-bili">
      <img class="vux-x-img ximg-demo" src="/static/TestIMG/logo.png" alt="品牌logo" />
    </p>
    <group>
      <cell title="货品 ：" :value.sync="soldProductInfo.name"></cell>
      <cell title="零售价 ：￥" :value.sync="soldProductInfo.retailPrice"></cell>
      <cell title="状态 ：" :value.sync="soldProductInfo.status"></cell>
      <cell title="销售员 ：" :value.sync="soldProductInfo.soldBy">
        <x-button type="primary">查看授权证书</x-button>
      </cell>
      <cell title="出售时间 ：" :value.sync="soldProductInfo.soldDate"></cell>
      <cell title="查验次数 ：" :value.sync="soldProductInfo.scanNum"></cell>
    </group>
    <x-button type="primary" @click="goToHomePage">返回</x-button>
    <div>
      <p>提示：</p>
      <p>1.零售价为全国统一售价，如有不符，请及时与我司联系</p>
      <p>2.全国统一客服电话：{{brandInfo.servicesPhone}}</p>
      <p>3.货品最终解释权归{{brandInfo.brandName}}所有</p>
    </div>
    <div>© 2016 ShareWin.me 粤ICP备14056388号</div>
  </div>
  <alert :show.sync="showErrorNoHandled" button-text="确认">{{errorMsgNoHandled}}</alert>
  <alert :show.sync="showCatchError" button-text="确认" @on-hide="catchErrorHandled">{{catchErrorMsg}}</alert>

  <alert :show.sync="showNoSaleError" button-text="我知道了" @on-hide="goToHomePage">
    <img alt="！" />
    <p>{{noSaleErrorMsg}}</p>
  </alert>
</div>
</template>

<script>
import {
  Group,
  Cell,
  XButton,
  Alert,
  Confirm
} from 'vux'
import brandInfoAPI from '../api/brandInfo'
import saleAPI from '../api/sale'
import authAPI from '../api/auth'
var request = require('../extend/http-request')

export default {
  components: {
    Group,
    Cell,
    XButton,
    Alert,
    Confirm
  },
  data() {
    return {
      userName: null,
      showUnsoldModel: false,
      showSoldModel: false,
      brandInfo: {
        brandName: null,
        servicesPhone: null
      },
      unsoldProductInfo: {
        name: null,
        productID: null,
        retailPrice: null,
        status: null
      },
      soldProductInfo: {
        name: null,
        retailPrice: null,
        status: null,
        soldBy: null,
        soldDate: null,
        scanNum: null
      },
      showErrorNoHandled: false,
      errorMsgNoHandled: null,
      showCatchError: false,
      catchErrorMsg: null,
      showComfirm: false,
      showSuccessNextStep: false,
      showNoSaleError: false,
      noSaleErrorMsg: null,
      showUnableToSale: false
    }
  },
  methods: {
    init() {
      var that = this

      this.getJsConfig()

      saleAPI.showPack({
        packcode: this.$route.params.packcode
      }).then(function(result) {
        console.log(JSON.stringify(result))
        if (result.sold) { //判断是否出售
          that.soldProductInfo.name = "幸运银内裤"
          that.soldProductInfo.retailPrice = "139.00"
          that.soldProductInfo.status = "已出售"
          that.getSolderName(result.sold_by)
          that.soldProductInfo.soldDate = result.sold_date
          that.soldProductInfo.scanNum = result.scan_num
          that.getBrandInfo()

          that.showSoldModel = true
          that.showUnsoldModel = false
        } else {
          that.unsoldProductInfo.name = "幸运银内裤"
          that.unsoldProductInfo.productID = that.getProductID(result.full_code)
          that.unsoldProductInfo.retailPrice = "139.00"
          that.unsoldProductInfo.status = "未出售"
          var owner = result.owner_id
          that.getBrandInfo()
            //检查是否已登录
          authAPI.getUser().then(function(result) {
            if (result.name != undefined) {
              //判断是否owner
              if (result.name == owner || owner == "") { //TODO: owner为空或者owner为上级
                that.showSoldModel = false
                that.showUnsoldModel = true
              } else {
                that.showUnableToSale = true
              }
            } else {
              that.showNoSaleError = true
              that.noSaleErrorMsg = "该货品尚未登记，如有疑问，请与厂家联系"
            }
          })

        }
      }).catch(function(err) {
        if (typeof(err) != "object") {
          if (err.match("no tag") != null) {
            that.showCatchError = true
            that.catchErrorMsg = "你所查询的货品不存在"
          } else {
            that.showCatchError = true
            that.catchErrorMsg = "货品出售功能异常，请稍后再试"
          }
        } else {
          that.showCatchError = true
          that.catchErrorMsg = "货品出售功能异常，请稍后再试"
        }
      })

    },
    getProductID(fullcode) {
      var boxFullCodeSegment = 6
      var codeArray = fullcode.split("-")
      var productID = null
      if (codeArray.length == boxFullCodeSegment) {
        productID = codeArray[3] + "-" + codeArray[4] + "-" + codeArray[5]
      } else {
        that.showCatchError = true
        that.catchErrorMsg = "该货品号为异常货品，请联系客服"
      }
      return productID
    },
    getSolderName(solderAccount) {
      var that = this
      saleAPI.getAgentInfo({
        user_account: solderAccount
      }).then(function(result) {
        var solderName = null
        for (var index in result.agent_details) {
          if (result.agent_details[index].key == "name") {
            that.soldProductInfo.soldBy = result.agent_details[index].value
          }
        }
      }).catch(function(err) {
        that.showErrorNoHandled = true
        that.errorMsgNoHandled = err
      })

    },
    getBrandInfo() {
      var that = this
      brandInfoAPI.getBrandInfo().then(function(result) {
        that.brandInfo.brandName = result.name

        for (var index in result.brand_details) {
          if (result.brand_details[index].key == "servicesPhone") {
            that.brandInfo.servicesPhone = result.brand_details[index].value
          }
        }
      }).catch(function(err) {
        that.showErrorNoHandled = true
        that.errorMsgNoHandled = err
      })
    },
    saleProduct() {
      var that = this

      saleAPI.packSoldBy({
        packcode: this.$route.params.packcode
      }).then(function(result) {
        if (result != null) {
          that.showSuccessNextStep = true
        } else {
          that.showErrorNoHandled = true
          that.errorMsgNoHandled = "货品出售功能异常，请稍后再试"
        }
      }).catch(function(err) {
        if (typeof(err) != "object") {
          if (err.match("no tag") != null) {
            that.showErrorNoHandled = true
            that.errorMsgNoHandled = "你所出售的货品不存在，无法出售"
          } else if (err.match("no tag") != null) {
            that.showErrorNoHandled = true
            that.errorMsgNoHandled = "货品出售功能异常，请稍后再试"
          }
        } else {
          that.showErrorNoHandled = true
          that.errorMsgNoHandled = "货品出售功能异常，请稍后再试"
        }
      })

    },
    goToHomePage() {
      this.$route.router.go('/homePage')
    },
    runWxScanQRCode() {
      this.showUnsoldModel = false
      console.log("调起微信扫一扫")

      window.wx.scanQRCode({
        needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode", "barCode"]
      })
    },
    catchErrorHandled() {
      this.$route.router.go('/homePage')
    },
    getJsConfig() {
      request.post('/wechat/getJsConfig', {
        list: ['scanQRCode'],
        url: window.location.href
      }).then((result) => {
        window.wx.config(result)
      })
    }
  },
  ready() {
    this.init()
  }
}
</script>
<style>
.brand-logo-bili img {
  width: 71%;
  height: auto;
  border: 1px solid #d3d1d1;
  margin: 0% auto 2%;
}
</style>
