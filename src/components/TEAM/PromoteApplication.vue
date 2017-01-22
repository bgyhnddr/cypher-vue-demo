<template>
<div class="vux-demo-header-box wapmain-header" slot="header">
  <x-header :left-options="{showBack: false}">确认提拔</x-header>
  <div slot="left" class="onclick-back" @click="onClickBack">返回</div>
</div>
<!-- 确认提拔 -->
<div v-if="showModelName == 'confirmPromotion'">
  <img width="250px" height="50px" src="/static/TestIMG/logo.png" alt="品牌logo" />
  <p>您已经被 {{promoterDate.name}} ( {{promoterDate.brandRoleName}} )</p>
  <p>提拔成为 {{promotionData.brand_role.name}}</p>

  <x-button type="primary" @click="confirm">确认信息</x-button>
</div>
<!-- 等待提拔 -->
<div v-if="showModelName == 'waitForAudit'">
  <p>正在进行审核，</p>
  <p>请耐心等待......</p>

  <x-button type="primary" @click="onClickBack">返回</x-button>
</div>
<!-- 提拔完成结果 -->
<div v-if="showModelName == 'promotionResult'">
  <img src="/static/TestIMG/successful.png" />
  <p>恭喜您，已成为 {{promotionData.brand_role.name}}</p>
  <p>您的级别将在下次登录中显示。</p>
</div>

<div class="all-footer">© 2016 ShareWin.me 粤ICP备14056388号</div>

<alert :show.sync="alert.showErrorNoHandled" button-text="确认">{{alert.errorMsgNoHandled}}</alert>
<alert :show.sync="alert.showCatchError" button-text="确认" @on-hide="errorHandled">{{alert.catchErrorMsg}}</alert>
</template>
<script>
import {
  XHeader,
  XButton,
  Alert
} from 'vux'
import authAPI from '../../api/auth'
import promoteAPI from '../../api/promote'

var request = require('../../extend/http-request')
var qrcanvas = require('qrcanvas')

export default {
  components: {
    XHeader,
    XButton,
    Alert
  },
  data() {
    return {
      showModelName: "", // ModelName : confirmPromotion, waitForAudit, promotionResult
      loginUser: null,
      promotionData: {
        brand_role: {
          name: null
        }
      },
      promoterDate: {
        name: null,
        brandRoleName: null
      },
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
      this.$route.router.go('/')
    },
    loadPromotion() {
      var that = this
      authAPI.getUser().then(function(result) {
        //检查是否登录
        if (result.name != undefined) {
          that.loginUser = result.name
          promoteAPI.getPromotion({
            promotionGuid: that.$route.params.agentPromotionGuid
          }).then(function(result) {
            that.promotionData = result

            //检查登录者是否提拔者或者被提拔者
            if (that.loginUser == result.promoter_user_account) {
              that.$route.router.go('/teamManagement/promoteShare/' + that.$route.params.agentPromotionGuid)
            } else if (that.loginUser == result.promotee_user_account) {
              that.checkPromotionStatus(that.promotionData)
            } else {
              that.alert.showCatchError = true
              that.alert.catchErrorMsg = "你无权查看此提拔信息，确认后返回到主页"
            }
          }).catch(function(err) {
            that.alert.showErrorNoHandled = true
            that.alert.errorMsgNoHandled = "加载提拔信息异常，请稍后重试"
          })

        } else {
          that.alert.showCatchError = true
          that.alert.catchErrorMsg = "请先登录，再扫一扫"
        }
      })
    },
    checkPromotionStatus(promotionData) {
      var that = this

      if (promotionData.employment == null) {
        promotionData.user.agent.agent_details.forEach((detailItem) => {
          if (detailItem.key == "name") {
            this.promoterDate.name = detailItem.value
          }
        })
        this.promoterDate.brandRoleName = promotionData.user.agent.agent_brand_role.brand_role.name

        this.showModelName = "confirmPromotion"
      } else {

        if (promotionData.status) {
          this.showModelName = "waitForAudit"

          var checkStatus = setInterval(function() {
            promoteAPI.getPromotion({
              promotionGuid: that.$route.params.agentPromotionGuid
            }).then(function(result) {
              if (!result.status) {
                that.showModelName = "promotionResult"
                clearInterval(checkStatus)
              }
            }).catch(function(err) {
              clearInterval(checkStatus)
              that.alert.showErrorNoHandled = true
              that.alert.errorMsgNoHandled = "加载提拔信息异常，请稍后重试"
            })
          }, 5000)
        } else {
          this.showModelName = "promotionResult"
        }

      }
    },
    confirm() {
      var that = this
      promoteAPI.confirmPromotion({
        promotionGuid: that.$route.params.agentPromotionGuid
      }).then(function(result) {
        that.loadPromotion()
      }).catch(function(err) {
        that.alert.showErrorNoHandled = true
        that.alert.errorMsgNoHandled = "确认提拔异常，请稍后重试"
      })
    },
    errorHandled() {
      location.href = location.origin + "/"
    },

  },
  ready() {
    this.loadPromotion()
  }
}
</script>
