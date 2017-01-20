<template>
<!-- <div class="brandauthorization-list">
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
</div> -->
<!-- <div class="all-footer" v-show="showBrandAuthorizationModel">© 2016 ShareWin.me 粤ICP备14056388号</div> -->
</template>
<script>
import {
  Alert
} from 'vux'
var request = require('../../extend/http-request')
var qrcanvas = require('qrcanvas')


export default {
  components: {
    Alert
  },
  data() {
    return {
      // publishEmploymentData: {},
      // employment_role_name: "",
      // loginUser: null,
      // showMsg: false,
      // errorMsg: null,
      // showRemindMsg: false,
      // remindMsg: null,
      // showBrandAuthorizationModel: false,
    }
  },
  methods: {
    // initData() {
    //   var that = this
    //   var account = null
    //   var publishEmploymentID = this.$route.params.publishEmploymentID
    //
    //
    //   authAPI.getUser().then(function(result) {
    //     if (result.name != undefined) {
    //       account = result.name
    //       that.loginUser = result.name
    //
    //       applyEmploymentAPI.getPublishEmploymentInfo({
    //         employmentGuid: publishEmploymentID
    //       }).then(function(result) {
    //         that.publishEmploymentData = result
    //
    //         if (account == that.publishEmploymentData.employer_user_account) {
    //
    //           if (result.status == false) {
    //             that.showRemindMsg = true
    //             that.remindMsg = "招募已关闭"
    //           } else {
    //             that.getEmploymentRoleName()
    //             that.showBrandAuthorizationModel = true
    //           }
    //         } else {
    //           that.$route.router.go('/employManagement/fillInEmployment/' + publishEmploymentID)
    //         }
    //       }).catch(function(err) {
    //         that.showRemindMsg = true
    //         that.remindMsg = err
    //       })
    //     } else {
    //       that.$route.router.go('/employManagement/fillInEmployment/' + publishEmploymentID)
    //     }
    //   })
    // },
    // getEmploymentRoleName() {
    //   var that = this
    //   employmentAPI.getRoleName({
    //     brand_role_code: that.publishEmploymentData.brand_role_code
    //   }).then(function(result) {
    //     that.employment_role_name = result.name
    //   }).catch(function(err) {
    //     that.showRemindMsg = true
    //     that.remindMsg = "获取招募角色资料出错"
    //   })
    // },
    // onHide() {
    //   if (this.loginUser == null) {
    //     location.href = location.origin + "/#!/auth/login"
    //   } else {
    //     location.href = location.origin + "/#!/employManagement"
    //   }
    // },
    // listenShare() {
    //   wx.onMenuShareAppMessage({
    //     link: window.location.href
    //   })
    //   wx.onMenuShareTimeline({
    //     link: window.location.href, // 分享链接
    //   })
    // }
  },
  ready() {
    // this.initData()
    // this.$els.qr.appendChild(qrcanvas({
    //   data: window.location.href,
    //   size: 300
    // }))
  }
}
</script>
