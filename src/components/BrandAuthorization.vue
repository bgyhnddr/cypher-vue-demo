<template>
  <div class="brandauthorization-list">
<div class="brandauthorization-bac" v-show="showBrandAuthorizationModel">
  <div class="brandauthorizations">
    <div class="brandauthorization-img">
      <p class="brand-logo">
        <img class="vux-x-img ximg-demo" src="/static/TestIMG/logo.png" alt="品牌logo" />
      </p>
      <p>开始招募
        <label> {{employment_role_name}}</label>
      </p>
      <p>点击右上角分享此页面
        <img src="/static/TestIMG/arrow .png" />
      </p>
      <p>或</p>
      <p>直接微信扫描二维码进行申请</p>
      <div v-el:qr class="qr-code "></div>
    </div>
  </div>
</div>
<alert :show.sync="showRemindMsg" button-text="确认" @on-hide="onHide">{{remindMsg}}</alert>
</div>
<div class="all-footer" v-show="showBrandAuthorizationModel">© 2016 ShareWin.me 粤ICP备14056388号</div>
</template>
<script>
import {
  Alert
} from 'vux'
import authAPI from '../api/auth'
import agentInfoAPI from '../api/agentInfo'
import employmentAPI from '../api/employment'
import applyEmploymentAPI from '../api/applyEmployment'
var request = require('../extend/http-request')
var qrcanvas = require('qrcanvas')


export default {
  components: {
    Alert
  },
  data() {
    return {
      publishEmploymentData: {},
      employment_role_name: "",
      loginUser: null,
      showMsg: false,
      errorMsg: null,
      showRemindMsg: false,
      remindMsg: null,
      showBrandAuthorizationModel: false,
    }
  },
  methods: {
    initData() {
      var that = this
      var account = null
      var publishEmploymentID = this.$route.params.publishEmploymentID


      authAPI.getUser().then(function(result) {
        if (result.name != undefined) {
          account = result.name
          that.loginUser = result.name

          applyEmploymentAPI.getPublishEmploymentInfo({
            employmentGuid: publishEmploymentID
          }).then(function(result) {
            that.publishEmploymentData = result

            if (account == that.publishEmploymentData.employer_user_account) {

              if (result.status == false) {
                that.showRemindMsg = true
                that.remindMsg = "招募已关闭"
              } else {
                that.getEmploymentRoleName()
                that.showBrandAuthorizationModel = true
              }
            } else {
              that.$route.router.go('/employManagement/fillInEmployment/' + publishEmploymentID)
            }
          }).catch(function(err) {
            that.showRemindMsg = true
            that.remindMsg = err
          })
        } else {
          that.$route.router.go('/employManagement/fillInEmployment/' + publishEmploymentID)
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
    }
  },
  ready() {
    this.initData()
    this.$els.qr.appendChild(qrcanvas({
      data: window.location.href,
      size: 300
    }))
  }
}
</script>
<style>
/*底部距离*/

.weui_tab_bd {
  padding-bottom: 0;
}

.brandauthorization-bac {
  min-height: 482px;
  background-size: 100%;

  width: 100%;
  margin: 0 auto;
}

.brandauthorizations {
  width: 88%;
  margin: auto;
  padding: 9% 0%;
  font-size: 3vw;
  color: #3f3a36;
  background: #fff;
}

.brandauthorizations h3 {
  font-size: 3vw;
}

.brandauthorization-img .brand-logo img {
  width: 71%;
  height: auto;
  border: 1px solid #d3d1d1;
  margin: 0% auto 2%;
}

.brandauthorization-img h3 {
  font-family: " 微软雅黑";
}

.brandauthorization-img p:nth-child(2) {
  font-size: 5.3vw;
  /*18px*/
  font-family: "微软雅黑";
  margin-top: 3%;
}

.brandauthorization-img p:nth-child(2) label {
  color: #ff1016;
}

.brandauthorization-img p:nth-child(3) {
  color: #393a3f;
  font-size: 4.5vw;
  /*14px*/
  margin-top: 2%;
}

.brandauthorization-img p:nth-child(3) img {
  width: 7%;
  height: auto;
  transform: rotate(23deg);
  -ms-transform: rotate(23deg);
  -moz-transform: rotate(23deg);
  -webkit-transform: rotate(23deg);
  -o-transform: rotate(23deg);
}

.brandauthorization-img p:nth-child(4) {
  color: #393a3f;
  font-size: 4.5vw;
  /*14px*/
  margin: -1% auto;
}

.brandauthorization-img p:nth-child(5) {
  color: #393a3f;
  font-size: 4.5vw;
  /*14px*/
  margin-bottom: 6%;
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

.qr-code {
  width: 65%;
  margin: auto;
  background: #e2e2e2;
  padding: 2% 2% 1% 2%;
}

.qr-code canvas {
  width: 95%!important;
  height: auto!important;
  border: 5px solid #fff;
}
.brandauthorization-list  .weui_dialog_ft {
  width: 89%;
  margin: 8% auto;
    background: #0bb20c;
  line-height: 35px;
  border-radius: 2px;
}

.brandauthorization-list .weui_dialog_bd {
  color: #000000;
  font-size: 5.2vw;
  /*17px*/
  font-family: "微软雅黑";
  margin-top: 5%;
}

.brandauthorization-list .weui_btn_dialog.primary {
  font-size: 4.9vw;
  /*16px*/
  color: #fff;
}

.brandauthorization-list  .weui_dialog {
  width: 92%;
}

</style>
