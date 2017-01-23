<template>
<div v-if="showUnsoldModel">
  <div class="saleProduct-sell-box">
    <!-- 未出售 -->
    <div class="saleProduct-sell-height">
      <p class="saleProduct-sell-logo">
        <img class="vux-x-img ximg-demo" src="/static/TestIMG/logo.png" alt="品牌logo" />
      </p>
      <group>
        <div class="saleProduct-sell-table">
          <cell title="货品 ：" :value.sync="unsoldProductInfo.name"></cell>
          <cell title="货号 ：" :value.sync="unsoldProductInfo.productID"></cell>
          <cell title="零售价 ：" :value.sync="unsoldProductInfo.retailPrice"></cell>
          <cell title="状态 ：" :value.sync="unsoldProductInfo.status"></cell>
        </div>
      </group>
      <x-button type="primary" @click="showComfirm=true" class="saleProduct-sell-button">出售此货品</x-button>
      <div class="saleProduct-sell-prompt">
        <p>提示：</p>
        <p>1.请核对货品信息，无误后点击出售</p>
        <p>2.全国统一客服电话：{{brandInfo.servicesPhone}}</p>
        <p>3.货品最终解释权归{{brandInfo.brandName}}所有</p>
      </div>

    </div>
  </div>
  <div class="saleProduct-sell-footer">由分得PMP货品监控平台数据支持<br/>© 2016 ShareWin.me 粤ICP备14056388号
  </div>

</div>
<div class="saleProduct-sell-sure">
  <confirm :show.sync="showComfirm" title="" confirm-text="确认" cancel-text="取消" @on-confirm="saleProduct">
    <p style="text-align:center;">确定出售此商品吗？</p>
  </confirm>
  <confirm :show.sync="showSuccessNextStep" title="" confirm-text="继续扫码" cancel-text="返回" @on-confirm="runWxScanQRCode" @on-cancel="goToHomePage">
    <p style="text-align:center;">请进行下一步操作？</p>
  </confirm>
  <div class="saleProduct-sell-notsure">
    <confirm :show.sync="showUnableToSale" title="" confirm-text="继续扫码" cancel-text="返回" @on-confirm="runWxScanQRCode" @on-cancel="goToHomePage">
      <img src="/static/TestIMG/notexclamation.png" />
      <p style="text-align:center;">您无权查看此货品</p>
    </confirm>
  </div>
</div>
<!-- 已出售 -->
<div v-if="showSoldModel">
  <div class="saleProduct-unsold-box">
    <div class="saleProduct-unsold-height">
      <p class="saleProduct-unsold-logo">
        <img class="vux-x-img ximg-demo" src="/static/TestIMG/logo.png" alt="品牌logo" />
      </p>
      <group>
        <div class="saleProduct-unsold-table">
          <cell title="货品 ：" :value.sync="soldProductInfo.name"></cell>
          <cell title="零售价 ：" :value.sync="soldProductInfo.retailPrice"></cell>
          <cell title="状态 ：" :value.sync="soldProductInfo.status"></cell>
          <cell title="销售员 ：" :value.sync="soldProductInfo.soldBy">
            <x-button type="primary" class="saleProduct-unsold-table-button" @click="goToMyCertificate">查看授权证书</x-button>
          </cell>
          <cell title="出售时间 ：" :value.sync="soldProductInfo.soldDate"></cell>
          <cell title="查验次数 ：" :value.sync="soldProductInfo.scanNum"></cell>
        </div>
      </group>
      <div class="saleProduct-unsold-prompt">
        <p>提示：</p>
        <p>1.零售价为全国统一售价，如有不符，请及时与我司联系</p>
        <p>2.全国统一客服电话：{{brandInfo.servicesPhone}}</p>
        <p>3.货品最终解释权归{{brandInfo.brandName}}所有</p>
      </div>
    </div>
  </div>
  <div class="saleProduct-unsold-footer">由分得PMP货品监控平台数据支持<br/>© 2016 ShareWin.me 粤ICP备14056388号
  </div>
</div>

</div>
<div class="saleProduct-unsold-sure">
  <div class="saleProduct-unsold-Thereisno">
    <alert :show.sync="showErrorNoHandled" button-text="确认">{{errorMsgNoHandled}}</alert>
    <alert :show.sync="showCatchError" button-text="确认" @on-hide="catchErrorHandled">{{catchErrorMsg}}</alert>
  </div>
  <alert :show.sync="showNoSaleError" button-text="我知道了" @on-hide="goToHomePage">
    <img src="/static/TestIMG/exclamation.png" />
    <p>{{{noSaleErrorMsg}}}</p>
  </alert>
</div>
<loading :show="showloading"></loading>
</template>

<script>
import {
  Group,
  Cell,
  XButton,
  Alert,
  Confirm,
  Loading
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
    Confirm,
    Loading
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
        salerID: null,
        soldDate: null,
        scanNum: null
      },
      showloading: false,
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

      saleAPI.showPack({
        packcode: this.$route.params.packcode
      }).then(function(result) {
        if (result.sold) { //判断是否出售
          that.soldProductInfo.name = "幸运银内裤"
          that.soldProductInfo.retailPrice = "￥" + "139.00"
          that.soldProductInfo.status = "已出售"
          that.soldProductInfo.salerID = result.sold_by
          that.getSolderName(result.sold_by)
          that.soldProductInfo.soldDate = new Date(result.sold_date).Format('yyyy-MM-dd hh:mm')
          that.soldProductInfo.scanNum = result.scan_num
          that.getBrandInfo()

          authAPI.getUser().then(function(result) {
            if (result.name != undefined) {
              //顶栏显示返回按钮
              that.$dispatch('displayShowBack', true)
            }
          })

          that.showSoldModel = true
          that.showUnsoldModel = false
        } else {
          that.unsoldProductInfo.name = "幸运银内裤"
          that.unsoldProductInfo.productID = that.getProductID(result.full_code)
          that.unsoldProductInfo.retailPrice = "￥" + "139.00"
          that.unsoldProductInfo.status = "未出售"
          var owner = result.owner_id
          that.getBrandInfo()
            //检查是否已登录
          authAPI.getUser().then(function(result) {
            if (result.name != undefined) {
              //顶栏显示返回按钮
              that.$dispatch('displayShowBack', true)
                //判断是否owner
              if (result.name == owner || owner == null) {
                that.showSoldModel = false
                that.showUnsoldModel = true
              } else {
                that.showUnableToSale = true
              }
            } else {
              that.showNoSaleError = true
              that.noSaleErrorMsg = "该货品尚未登记<br/>如有疑问，请与厂家联系"
            }
          })

        }
      }).catch(function(err) {
        if (typeof(err) != "object") {
          if (err.match("no tag") != null || err.match("not pack tag") != null) {
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
        result.agent_details.map((o) => {
          if (o.key == "name") {
            that.soldProductInfo.soldBy = o.value
          }
        })
      }).catch(function(err) {
        that.showErrorNoHandled = true
        that.errorMsgNoHandled = err
      })

    },
    getBrandInfo() {
      var that = this
      brandInfoAPI.getBrandInfo().then(function(result) {
        that.brandInfo.brandName = result.name
        result.brand_details.map((o) => {
          if (o.key == "servicesPhone") {
            that.brandInfo.servicesPhone = o.value
          }
        })
      }).catch(function(err) {
        that.showErrorNoHandled = true
        that.errorMsgNoHandled = err
      })
    },
    saleProduct() {
      var that = this

      this.showloading = true

      saleAPI.packSoldBy({
        packcode: this.$route.params.packcode
      }).then(function(result) {
        that.showloading = false
        if (result != null) {
          that.showSuccessNextStep = true
        } else {
          that.showErrorNoHandled = true
          that.errorMsgNoHandled = "货品出售功能异常，请稍后再试"
        }
      }).catch(function(err) {
        that.showloading = false
        if (typeof(err) != "object") {
          if (err.match("no tag") != null || err.match("not pack tag") != null) {
            that.showCatchError = true
            that.showCatchError = "你所出售的货品不存在，无法出售"
          } else if (err.match("already sold") != null) {
            that.showCatchError = true
            that.showCatchError = "该货品已出售"
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
    goToMyCertificate() {
      this.$route.router.go("/accountManagement/CertificateInfo/" + this.soldProductInfo.salerID + "/sale/#/#/" + this.$route.params.packcode)
    },
    runWxScanQRCode() {
      this.showUnsoldModel = false

      window.wx.scanQRCode({
        needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode", "barCode"]
      })
    },
    catchErrorHandled() {
      this.$route.router.go('/homePage')
    }
  },
  ready() {
    this.init()
  }
}
</script>
<style>
/*未出售*/

.saleProduct-sell-height {
  min-height: 460px;
}

.saleProduct-sell-box {
  width: 100%;
  margin: auto;
}

p.saleProduct-sell-logo {
  width: 100%;
  text-align: center;
  margin: 4% auto 0 auto;
}

.saleProduct-sell-logo img {
  width: 65%;
  height: auto;
  margin: 0% auto 2%;
}

.saleProduct-sell-table .weui_cell_hd {
  width: auto;
}

.saleProduct-sell-table {
  text-align: left;
  background: #fff;
  padding: 0;
  font-family: "微软雅黑";
  font-size: 4.5vw;
}

.saleProduct-sell-table .weui_cell:before {
  border-top: 0;
}

.saleProduct-sell-table .weui_cell {
  border-bottom: 1px solid #d3d1d1;
}

.saleProduct-sell-table .weui_cell:nth-child(4) {
  border-bottom: 0
}

.saleProduct-sell-table .weui_cell:nth-child(4) .weui_cell_ft {
  color: #f4604b
}

.saleProduct-sell-table .weui_cell_primary {
  -webkit-box-flex: inherit!important;
  -ms-flex: inherit!important;
  flex: inherit!important;
  width: 28%;
  text-align: right;
}

.saleProduct-sell-prompt {
  width: 88%;
  margin: 3% auto;
  color: #d22d23;
  font-family: "微软雅黑";
  font-size: 3.9vw;
}

.saleProduct-sell-footer {
  width: 100%;
  text-align: center;
  color: #979797;
  font-size: 3vw;
  font-family: "微软雅黑";
  line-height: 1.5em;
  margin-bottom: 20%;
}

button.weui_btn.saleProduct-sell-button.weui_btn_primary {
  position: fixed;
  bottom: 0;
  width: 100%;
  border-radius: 0;
  font-size: 5.2vw;
  line-height: 2.3em;
  z-index: 100000
}

.saleProduct-sell-box .weui_btn:after {
  border: 0;
  border-radius: 0;
}

.saleProduct-sell-box .weui_cell_ft {
  color: #595959;
  padding-left: 4%;
}


/*已出售*/

.saleProduct-unsold-height {
  min-height: 450px;
}

.saleProduct-unsold-box {
  width: 100%;
  margin: auto;
}

p.saleProduct-unsold-logo {
  width: 100%;
  text-align: center;
  margin: 4% auto 0 auto;
}

.saleProduct-unsold-logo img {
  width: 65%;
  height: auto;
  margin: 0% auto 2%;
}

.saleProduct-unsold-table .weui_cell_hd {
  width: auto;
}

.saleProduct-unsold-table {
  text-align: left;
  padding: 0;
  font-family: "微软雅黑";
  font-size: 4.5vw;
}

.saleProduct-unsold-table .weui_cell:before {
  border-top: 0;
}

.saleProduct-unsold-table .weui_cell {
  border-bottom: 1px solid #d3d1d1;
}

.saleProduct-unsold-table .weui_cell:nth-child(6) {
  border-bottom: 0
}

.saleProduct-unsold-table .weui_cell:nth-child(3) .weui_cell_ft {
  color: #21c36d
}

.saleProduct-unsold-table .weui_cell_primary {
  -webkit-box-flex: inherit!important;
  -ms-flex: inherit!important;
  flex: inherit!important;
  width: 28%;
  text-align: right;
}

.saleProduct-unsold-prompt {
  width: 88%;
  margin: 3% auto;
  color: #d22d23;
  font-family: "微软雅黑";
  font-size: 3.9vw;
}

.saleProduct-unsold-footer {
  width: 100%;
  text-align: center;
  color: #979797;
  font-size: 3vw;
  font-family: "微软雅黑";
  line-height: 1.5em;
  margin-bottom: 10%;
}

button.weui_btn.saleProduct-unsold-button.weui_btn_primary {
  position: fixed;
  bottom: 0;
  width: 100%;
  border-radius: 0;
  font-size: 5.2vw;
  line-height: 2.3em;
}

.saleProduct-unsold-box .weui_btn:after {
  border: 0;
  border-radius: 0;
}

.saleProduct-unsold-box .weui_cell_ft {
  color: #595959;
  padding-left: 4%;
}

.saleProduct-unsold-box button.weui_btn.saleProduct-unsold-table-button.weui_btn_primary {
  position: absolute;
  width: 33%;
  font-size: 3.9vw;
  background: #5091d5;
  top: 18%;
  left: 63%;
  border-radius: 2px;
}


/*button*/

.saleProduct-sell-sure .weui_dialog_ft {
  width: 89%;
  margin: 8% auto;
  line-height: 35px;
  border-radius: 2px;
  border: 0
}

.saleProduct-sell-sure .weui_dialog_ft:after {
  border: 0
}

.saleProduct-sell-sure .weui_dialog_confirm .weui_dialog_ft a {
  background: none;
  border: 0;
  line-height: 31px;
}

.saleProduct-sell-sure .weui_dialog_ft a:nth-child(1) {
  background: #9b9b9b;
  color: #fff;
  font-size: 4.5vw;
}

.saleProduct-sell-sure .weui_dialog_ft a:nth-child(2) {
  background: #21c36d;
  margin-left: 3%;
  font-size: 4.5vw;
}

.saleProduct-sell-sure .weui_dialog_bd {
  color: #000000;
  font-size: 5.2vw;
  /*17px*/
  font-family: "微软雅黑";
  margin: 5% 0 12% 0;
  text-align: center!important;
}

.saleProduct-sell-sure .weui_btn_dialog.primary {
  font-size: 4.9vw;
  /*16px*/
  color: #fff;
}

.saleProduct-sell-sure .weui_dialog {
  width: 92%;
}


/*提示框*/

.saleProduct-unsold-sure .weui_dialog_ft {
  width: 89%;
  margin: 4% auto;
  background: #0bb20c;
  line-height: 35px;
  border-radius: 2px;
}

.saleProduct-unsold-sure .weui_dialog_bd {
  color: #000000;
  font-size: 5.2vw;
  /*17px*/
  font-family: "微软雅黑";
  margin-top: 0;
}

.saleProduct-unsold-sure .weui_btn_dialog.primary {
  font-size: 4.9vw;
  /*16px*/
  color: #fff;
  background: #21c36d;
}

.saleProduct-unsold-sure .weui_dialog {
  width: 92%;
}

.saleProduct-unsold-sure img {
  width: 28%;
}

.saleProduct-unsold-sure .weui_dialog_hd {
  padding: 0.2em 0 .5em!important;
}

.saleProduct-sell-sure img {
  width: 28%;
  margin: auto;
}

.saleProduct-sell-notsure .weui_dialog_hd {
  padding: 0.2em 0 .5em!important;
}

.saleProduct-sell-notsure .weui_dialog_bd {
  margin: 0 0 5% 0!important
}

.saleProduct-sell-notsure .weui_dialog_ft {
  margin: 4% auto!important;
}

.saleProduct-unsold-Thereisno {}

.saleProduct-unsold-Thereisno .weui_dialog_bd {
  color: #000000;
  font-size: 5.2vw;
  /*17px*/
  font-family: "微软雅黑";
  margin: 5% 0 12% 0;
  text-align: center!important;
}

.saleProduct-unsold-Thereisno .weui_dialog_ft {
  margin: 8% auto;
}
</style>
