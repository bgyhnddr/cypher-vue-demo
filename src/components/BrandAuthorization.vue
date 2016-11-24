<template>
<div>
  <div class="brandauthorization-bac" v-if="showBrandAuthorizationModel">
    <div class="brandauthorizations">
      <div class="brandauthorization-img">
        <p class="brand-logo">
          <img class="vux-x-img ximg-demo" src="/static/TestIMG/logo.png" alt="品牌logo" />
        </p>
        <p>开始招募 {{employment_role_name}}</p>
        <p>点击右上角分享此页面</p>
        <p>或</p>
        <p>直接微信扫描二维码进行申请</p>
        <vue-qrcode :val.sync="qrcodeHref" bg-color="#FFFFFF" fg-color="#000000" ></vue-qrcode>
      </div>
    </div>
  </div>
  <alert :show.sync="showRemindMsg" button-text="确认" @on-hide="onHide">{{remindMsg}}</alert>
</div>
</template>
<script>
import {
  Alert
} from 'vux'
import VueQrcode from 'vue-qrcode'
import authAPI from '../api/auth'
import agentInfoAPI from '../api/agentInfo'
import employmentAPI from '../api/employment'
import applyEmploymentAPI from '../api/applyEmployment'
var request = require('../extend/http-request')


export default {
  components: {
    Alert,
    VueQrcode
  },
  data() {
    return {
      publishEmploymentData: {},
      employment_role_name: "",
      loginUser: null,
      showBrandAuthorizationModel: false,
      qrcodeHref: null,
      showMsg: false,
      errorMsg: null,
      showRemindMsg: false,
      remindMsg: null,

    }
  },
  methods: {
    initData() {
      var that = this
      var account = null
      var publishEmploymentID = this.$route.params.publishEmploymentID
      that.qrcodeHref = window.location.href
      
      authAPI.getUser().then(function(result) {
        if (result.name != undefined) { //登录状态
          account = result.name
          that.loginUser = result.name

          //获取发起招募信息
          applyEmploymentAPI.getPublishEmploymentInfo({
            employmentGuid: publishEmploymentID
          }).then(function(result) {
            that.publishEmploymentData = result

            if (account == that.publishEmploymentData.employer_user_account) { //判断是否发起人

              var startDate = new Date(result.create_time)
              var endDate = new Date(startDate.getTime() + 2 * 3600 * 1000)

              if (result.status == false || endDate <= new Date()) {
                that.showRemindMsg = true
                that.remindMsg = "招募已关闭"
              } else {
                //TODO : 页面内容搜索
                //获取招募角色名称
                that.getEmploymentRoleName()

              }
            } else { //非发起人状态
              that.$route.router.go('/employManagement/fillInEmployment/' + publishEmploymentID)
            }
          }).catch(function(err) {
            that.showRemindMsg = true
            that.remindMsg = err
          })
        } else { //非登录状态
          that.$route.router.go('/employManagement/fillInEmployment/' + publishEmploymentID )
        }
      })
    },
    getEmploymentRoleName() {
      var that = this
      employmentAPI.getRoleName({
        brand_role_code: that.publishEmploymentData.brand_role_code
      }).then(function(result) {
        that.employment_role_name = result.name
      }).catch(function(err) {
        that.showRemindMsg = true
        that.remindMsg = "获取招募角色资料出错"
      })
      that.showBrandAuthorizationModel = true
    },
    onHide() {
      if (this.loginUser == null) {
        location.href = location.origin + "/#!/auth/login"
      } else {
        location.href = location.origin + "/#!/employManagement"
      }
    },
    listenShare() {
      wx.onMenuShareAppMessage({
        link: window.location.href
      })
      wx.onMenuShareTimeline({
        link: window.location.href, // 分享链接
      })
    },
    getJsConfig() {
      var that = this
      request.post('/wechat/getJsConfig', {
        list: ['scanQRCode', 'chooseImage', 'uploadImage'],
        url: window.location.href
      }).then((result) => {
        window.wx.config(result)
        window.wx.ready(() => {
          that.listenShare()
        })
      })
    }
  },
  ready() {
    this.initData()
  }
}
</script>
<style>
/*底部距离*/

.weui_tab_bd {
  padding-bottom: 0;
}

.brandauthorization-bac {
  background: url(/static/TestIMG/PowerOfAttorney-bac.png) no-repeat;
  background-size: 100%;
  width: 100%;
  margin: 3% auto;
}

.brandauthorizations {
  width: 75%;
  margin: auto;
  padding: 13% 0%;
  font-size: 3vw;
  color: #3f3a36;
}

.brandauthorizations h3 {
  font-size: 3vw;
}

.brandauthorization-img .brand-logo img {
  width: 62%;
  height: auto;
  margin: 4% auto 2%;
}

.brandauthorization-img h3 {
  font-family: " 微软雅黑";
}

.authorization {
  width: 57%;
  height: auto;
}

.brandauthorization-img {
  text-align: center;
}

table.personal-identity {
  font-family: "微软雅黑";
  width: 100%;
  margin: auto;
}

table.personal-identity tbody tr td {
  font-family: "微软雅黑";
  text-align: left;
}

table.personal-identity tbody tr td img {
  width: 58px;
  height: auto;
  margin-right: 0;
  min-height: 76px;
  min-width: 46px;
}

.color-gray {
  color: #57534d;
}

.set-agent {
  font-family: "微软雅黑";
  text-align: center;
}

.set-agent label {
  font-size: 3.9vw!important;
  /*12px*/
  color: #36bdaf;
  font-family: "微软雅黑";
}

.allow-agent {
  text-align: center;
  font-family: "微软雅黑";
}

.agent-message {
  margin: 8% 0 0 0;
  text-align: left;
}

.agent-message p {
  text-align: left;
  font-family: "微软雅黑";
}

.agent-unit {
  font-family: "微软雅黑";
  text-align: right;
  margin-bottom: 42%
}

.agent-height {
  margin: 8% 0px 10%;
  height: 38px
}
</style>
