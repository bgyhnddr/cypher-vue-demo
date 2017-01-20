<template>
<div class="vux-demo-header-box wapmain-header" slot="header">
  <x-header :left-options="{showBack: false}">分享提拔页</x-header>
  <div slot="left" class="onclick-back" @click="onClickBack">返回</div>
</div>
<div v-show="showModel.promoteShare">
  <div>
    <img src="/static/TestIMG/logo.png" alt="品牌logo" />
    </p>
    <p>团队成员提拔至
      <label> {{promotionData.brand_role.name}}</label>
    </p>
    <p>点击右上角分享此页面
      <img src="/static/TestIMG/arrow .png" />
    </p>
    <p>或</p>
    <p>直接微信扫描二维码进行申请</p>
    <div v-el:qr class="qr-code"></div>
  </div>
</div>
<div class="all-footer">© 2016 ShareWin.me 粤ICP备14056388号</div>

<alert :show.sync="alert.showErrorNoHandled" button-text="确认">{{alert.errorMsgNoHandled}}</alert>
<alert :show.sync="alert.showCatchError" button-text="确认" @on-hide="errorHandled">{{alert.catchErrorMsg}}</alert>
</template>
<script>
import {
  XHeader,
  Alert
} from 'vux'
import authAPI from '../../api/auth'
import promoteAPI from '../../api/promote'

var request = require('../../extend/http-request')
var qrcanvas = require('qrcanvas')

export default {
  components: {
    XHeader,
    Alert
  },
  data() {
    return {
      showModel: {
        promoteShare: false
      },
      loginUser: null,
      promotionData: {
        brand_role: {
          name: null
        }
      },
      isPromoterFlag: false,
      alert: {
        showCatchError: false,
        catchErrorMsg: null,
        showErrorNoHandled: false,
        errorMsgNoHandled: null
      }
    }
  },
  methods: {
    onClickBack() {
      if (this.isPromoterFlag) {
        this.$route.router.go('/')
      } else {
        this.$route.router.go('/teamManagement/choosePromoteRole/' + this.$route.params.agentPromotionGuid)
      }
    },
    loadPromotion() {
      var that = this
      promoteAPI.getPromotion({
        promotionGuid: this.$route.params.agentPromotionGuid
      }).then(function(result) {
        console.log(JSON.stringify(result))
        that.promotionData = result
        that.checkLoginUser()
      }).catch(function(err) {
        that.alert.showErrorNoHandled = true
        that.alert.errorMsgNoHandled = "加载提拔信息异常，请稍后重试"
      })
    },
    checkLoginUser() {
      var that = this

      authAPI.getUser().then(function(result) {
        console.log("登录者=" + result.name)
        if (result.name != undefined) {

          if (result.name == that.promotionData.promoter_user_account) {
            that.isPromoterFlag = true

            if (that.promotionData.status == false) {
              that.alert.showCatchError = true
              that.alert.catchErrorMsg = "提拔已关闭，确认后返回到主页"
            } else {
              that.showModel.promoteShare = true
            }
          } else if (result.name == that.promotionData.promotee_user_account) {
            that.$route.router.go('/teamManagement/promoteApplication/' + that.$route.params.agentPromotionGuid)
          } else {
            that.alert.showCatchError = true
            that.alert.catchErrorMsg = "你无权查看此提拔信息，确认后返回到主页"
          }
        } else {
          that.alert.showCatchError = true
          that.alert.catchErrorMsg = "请先登录，再扫一扫"
        }
      })
    },
    errorHandled() {
      location.href = location.origin + "/"
    },
    listenShare() {
      wx.onMenuShareAppMessage({
        link: window.location.href
      })
      wx.onMenuShareTimeline({
        link: window.location.href, // 分享链接
      })
    }
  },
  ready() {
    this.loadPromotion()
    this.$els.qr.appendChild(qrcanvas({
      data: window.location.href,
      size: 300
    }))
  }
}
</script>
