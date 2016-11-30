<template>
<div style="overflow-x: hidden;">
  <loading :show="isLoading" position="absolute"></loading>
  <view-box v-ref:view-box>
    <!--header slot-->
    <div class="vux-demo-header-box wapmain-header" slot="header">
      <x-header :left-options="leftOptions" transition="headerTransition" :title="title" @on-click-title="scrollTop"></x-header>
      <div slot="left" v-if="ShowBack" class="onclick-back" @click="onClickBack">{{backText}}</div>
    </div>
    <!--default slot-->
    <router-view></router-view>
  </view-box>
</div>
</template>
<script>
import {
  Tabbar,
  TabbarItem,
  Loading,
  ViewBox,
  XHeader
} from 'vux'
import authAPI from '../api/auth'
require('vux/dist/vux.css')

export default {
  components: {
    Tabbar,
    TabbarItem,
    Loading,
    ViewBox,
    XHeader
  },
  data() {
    return {
      leftOptions: {
        showBack: false,
        backText: '',
        preventGoBack: false
      },
      ShowBack: false,
      backText: "返回"
    }
  },
  computed: {
    title() {
      this.backText = "返回"
      if (this.$route.path === '/index') {
        this.ShowBack = false
        return 'Home'
      } else if (this.$route.path === '/auth/login') {
        document.body.style.background = '#fff'
        this.ShowBack = false
        return '登录'
      } else if (this.$route.path === '/auth/changepwd') {
        this.ShowBack = true
        document.body.style.background = '#fff'
        return '修改密码'
      } else if (this.$route.path === '/homePage') {
        this.backText = "退出"
        this.ShowBack = true
        document.body.style.background = '#f2f2f2'
        this.$on('backButton', function(showHomePageModel) {
          if (showHomePageModel) {
            this.backText = "退出"
          } else {
            this.backText = "返回"
          }
        })
        return
      } else if (this.$route.name === 'HomePageSearch') {
        document.body.style.background = '#f2f2f2'
        this.ShowBack = true
        return
      } else if (this.$route.path === '/employManagement') {
        document.body.style.background = '#f2f2f2'
        this.ShowBack = true
        return '成员招募'
      } else if (this.$route.path === '/employManagement/chooseEmployableRoles') {
        this.ShowBack = true
        document.body.style.background = '#fff'
        return '选择招募代理级别'
      } else if (this.$route.name === 'BrandAuthorization') {
        document.body.style.background = '#f2f2f2'
        this.ShowBack = true
        return '分享招募'
      } else if (this.$route.name === 'FillInEmployment') {
        document.body.style.background = '#f2f2f2'
        this.ShowBack = false
        this.$on('fillInEmployment_goBack', function(flag) {
          this.ShowBack = flag
        })
        return "代理申请"
      } else if (this.$route.path === '/employManagement/employmentSubmission') {
        document.body.style.background = '#fff'
        this.ShowBack = false
        return "代理申请"
      } else if (this.$route.path === '/employManagement/audit') {
        this.ShowBack = true
        document.body.style.background = '#f2f2f2'
        return '资料审核'
      } else if (this.$route.name === 'AuditInfo') {
        this.ShowBack = true
        if (this.$route.params.locate == 'audit') {
          document.body.style.background = '#f2f2f2'
          return '审核详情'
        } else if (this.$route.params.locate == 'history') {
          document.body.style.background = '#f2f2f2'
          return '招募详情'

        }
      } else if (this.$route.path === '/employManagement/employmentHistory') {
        this.ShowBack = true
        document.body.style.background = '#f2f2f2'
        return '招募历史'
      } else if (this.$route.path === '/accountManagement') {
        this.ShowBack = true
        document.body.style.background = '#f2f2f2'
        return '我的账号'
      } else if (this.$route.name === 'MyCertificate') {
        this.ShowBack = true
        document.body.style.background = '#f2f2f2'
        return '我的证书'
      } else if (this.$route.name === 'CertificateInfo') {
        document.body.style.backgroundImage = 'url(/static/TestIMG/certificateinfo_bac.png)'
        document.body.style.backgroundRepeat = 'no-repea'
        document.body.style.backgroundSize = 'contain'
        this.ShowBack = true
        return '授权证书'
      } else if (this.$route.path === '/employManagement/currentList') {
        this.ShowBack = true
        document.body.style.background = '#f2f2f2'
        return '当前招募'
      } else if (this.$route.name === 'CurrentInfo') {
        this.ShowBack = true
        document.body.style.background = '#f2f2f2'
        return '查看详情'
      } else if (this.$route.name === 'adminbrand') {
        document.body.style.background = '#fff'
        this.ShowBack = true
        return 'adminBrand'
      } else if (this.$route.name === 'CheckPwd') {
        document.body.style.background = '#fff'
        this.ShowBack = true
        return '使用登录密码'
      } else if (this.$route.name === 'PhoneVerification') {
        document.body.style.background = '#fff'
        this.ShowBack = true
        return '忘记密码'
      } else if (this.$route.name === 'resetpwd') {
        this.ShowBack = true
        return '重置密码'
      } else if (this.$route.path === '/accountManagement/changeWechat') {
        this.ShowBack = true
        return '修改微信号'
      } else if (this.$route.path === '/auth/SuccessPage') {
        this.ShowBack = false
        return '修改成功'
      } else if (this.$route.path === '/accountManagement/changeCellPhone') {
        this.ShowBack = true
        return '修改手机号'
      } else if (this.$route.path === '/saleManagement/sale') {
        this.ShowBack = true
        return '货品出售'
      }

    }
  },
  methods: {
    scrollTop() {
      this.$refs.viewBox.$els.viewBoxBody.scrollTop = 0
    },
    onClickBack() {
      var path = this.$route.path
      var name = this.$route.name
      var FirstPath = path.split('/')[1]
      var SecPath = path.split('/')[2]
      if (FirstPath == "auth") {
        if (SecPath == "changepwd") {
          this.$route.router.go('/accountManagement')
          return
        } else if (SecPath == "PhoneVerification") {
          if (this.$route.params.locate == 'login') {
            this.$route.router.go('/index')
            return
          } else if (this.$route.params.locate == 'account') {
            this.$route.router.go('/accountManagement')
            return
          }
        } else if (SecPath == "resetpwd") {
          if (this.$route.params.locate == 'login') {
            this.$route.router.go('/auth/PhoneVerification/login')
            return
          } else if (this.$route.params.locate == 'account') {
            this.$route.router.go('/auth/PhoneVerification/account')
            return
          }
        }
      } else if (FirstPath == "homePage") {
        if (!SecPath) {
          if (this.backText == 　"返回") {
            // window.location.reload()
            this.$broadcast('showHomePage')
          } else {
            //登出
            authAPI.logout()
            this.$route.router.go('/')
          }
          return
        }
      } else if (FirstPath == "employManagement") {
        if (!SecPath) {
          this.$route.router.go('/homePage')
          return
        }
        if (SecPath == "chooseEmployableRoles") {
          this.$route.router.go('/employManagement')
          return
        } else if (SecPath == "brandAuthorization") {
          location.href = location.origin + "/#!/employManagement/chooseEmployableRoles"
          return
        } else if (SecPath == "fillInEmployment") {
          this.$broadcast('goFillEmployment1')
          return
        } else if (SecPath == "audit") {
          this.$route.router.go('/employManagement')
          return
        } else if (SecPath == "auditInfo") {
          if (this.$route.params.locate == "audit") {
            this.$route.router.go('/employManagement/audit')
            return
          } else if (this.$route.params.locate == "history") {
            this.$route.router.go('/employManagement/employmentHistory')
            return
          }
        } else if (SecPath == "employmentHistory") {
          this.$route.router.go('/employManagement')
          return
        } else if (SecPath == "currentList") {
          this.$route.router.go('/employManagement')
          return
        } else if (SecPath == "currentInfo") {
          this.$route.router.go('/employManagement/currentList')
          return
        }
      } else if (FirstPath == "accountManagement") {
        if (!SecPath) {
          this.$route.router.go('/homePage')
          return
        } else if (SecPath == "MyCertificate") {
          this.$route.router.go('/accountManagement')
          return
        } else if (SecPath == "CertificateInfo") {
          if (this.$route.params.locate == "account") {
            this.$route.router.go('/accountManagement/MyCertificate/' + this.$route.params.from + '/' + this.$route.params.locate)
            return
          } else if (this.$route.params.locate == "auditInfo") {
            this.$route.router.go('/employManagement/auditInfo/' + this.$route.params.from + '/' + this.$route.params.employmentID + '/' + this.$route.params.brandID + '/audit')
            return
          } else if (this.$route.params.locate == "history")
            this.$route.router.go('/employManagement/auditInfo/' + this.$route.params.from + '/' + this.$route.params.employmentID + '/' + this.$route.params.brandID + '/history')
          return
        } else if (SecPath == "checkPwd") {
          this.$route.router.go('/accountManagement')
          return
        } else if (SecPath == "changeWechat") {
          this.$route.router.go('/accountManagement/checkPwd/wechat')
          return
        } else if (SecPath == "changeCellPhone") {
          this.$route.router.go('/accountManagement/checkPwd/phone')
          return
        }
      } else if (FirstPath == "saleManagement") {
         if (SecPath == "sale") {
          this.$route.router.go('/homePage')
          return
        }
      }
    }
  }
}
</script>
<style>
body,
html {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}

body {
  background-color: #fbf9fe;
}

.view {
  transition: all 0.3s ease;
}

.fate-enter,
.fate-leave {
  opacity: 0;
}

.onclick-back {
  position: absolute;
  top: 21%;
  left: 4%;
  font-size: 14px;
  font-family: "微软雅黑";
  width: 20%;
  height: 61%;
  line-height: 2em;
  background: url("/static/TestIMG/back.png");
  background-repeat: no-repeat;
  background-size: contain;
  padding-left: 7%;
}

.onclick-back button {
  font-size: 14px;
  font-family: "微软雅黑";
  background: none;
  border: 0;
  color: #fff;
}

.view {
  transition: all 0.3s ease;
}

.fate-enter,
.fate-leave {
  opacity: 0;
}

.wapmain-header {
  position: relative;
}

.onclick-back {
  position: absolute;
  top: 21%;
  left: 4%;
  font-size: 14px;
  font-family: "微软雅黑";
  width: 20%;
  height: 61%;
  line-height: 2em;
  background: url("/static/TestIMG/back.png");
  background-repeat: no-repeat;
  background-size: contain;
  padding-left: 7%;
  border: 0;
  color: #fff;
}

.onclick-back button {
  font-size: 14px;
  font-family: "微软雅黑";
  background: none;
  border: 0;
  color: #fff;
}


/*底栏信息*/

.all-footer {
  width: 100%;
  text-align: center;
  color: #979797;
  font-size: 3vw;
  font-family: "微软雅黑";
  line-height: 2.5em;
  margin-bottom: 2%;
}
</style>
