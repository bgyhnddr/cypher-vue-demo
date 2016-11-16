<template>
<div style="overflow-x: hidden;">
  <loading :show="isLoading" position="absolute"></loading>
  <view-box v-ref:view-box>
    <!--header slot-->
    <div class="vux-demo-header-box wapmain-header" slot="header" >
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
                    return
                } else if (this.$route.name === 'HomePageSearch') {
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
                    this.ShowBack = true
                    return this.$route.params.brandName
                } else if (this.$route.name === 'FillInEmployment') {
                    document.body.style.background = '#f2f2f2'
                    this.ShowBack = false
                    this.$on('fillInEmployment_goBack', function(flag) {
                        console.log("event" + "==========" + flag)
                        this.ShowBack = flag
                    })
                    return this.$route.params.brandName + "——代理授权申请"
                } else if (this.$route.name === 'EmploymentSubmission') {
                    this.ShowBack = false
                    return this.$route.params.brandName + "——代理授权申请"

                } else if (this.$route.path === '/employManagement/audit') {
                    this.ShowBack = true
                    document.body.style.background = '#f2f2f2'
                    return '资料审核'
                } else if (this.$route.name === 'AuditInfo') {
                    this.ShowBack = true
                    if (this.$route.params.locate == 'audit') {
                        return '审核详情'
                    } else if (this.$route.params.locate == 'history') {
                        return '招募详情'
                        document.body.style.background = '#f2f2f2'
                    }
                } else if (this.$route.path === '/employManagement/employmentHistory') {
                    this.ShowBack = true
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
                    this.ShowBack = true
                    return 'adminBrand'
                } else if (this.$route.path === '/employManagement/currentList') {
                    this.ShowBack = true
                    document.body.style.background = '#f2f2f2'
                    return '当前招募'
                } else if (this.$route.name === 'CurrentInfo') {
                    this.ShowBack = true
                    return '查看详情'
                } else if (this.$route.name === 'adminbrand') {
                    document.body.style.background = '#fff'
                    this.ShowBack = true
                    return 'adminBrand'
                } else if (this.$route.name === 'CheckPwd') {
                    this.ShowBack = true
                    return '使用登录密码'
                } else if (this.$route.name === 'PhoneVerification') {
                    this.ShowBack = true
                    return '发送验证码'
                } else if (this.$route.name === 'ResetPwd') {
                    this.ShowBack = true
                    return '重置密码'
                } else if (this.$route.path === 'changeWechat') {
                    this.ShowBack = true
                    return '修改微信号'
                } else if (this.$route.path === '/auth/SuccessPage') {
                    this.ShowBack = false
                    return '修改成功'
                } else if (this.$route.path === '/accountManagement/changeCellPhone') {
                    this.ShowBack = true
                    return '修改手机号'
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
                        //登出
                        authAPI.logout()
                        this.$route.router.go('/')
                        return
                    } else if (SecPath == "search") {
                        this.$route.router.go('/homePage')
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
                        this.$route.router.go('/employManagement/chooseEmployableRoles')
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
                            this.$route.router.go('/accountManagement/MyCertificate/' + this.$route.params.account + '/' + this.$route.params.locate)
                            return
                        } else if (this.$route.params.locate == "audit") {
                            this.$route.router.go('/employManagement/auditInfo/' + this.$route.params.account + '/' + this.$route.params.employmentID + '/' + this.$route.params.brandID + '/' + this.$route.params.locate)
                            return
                        } else if (this.$route.params.locate == "history")
                            this.$route.router.go('/employManagement/auditInfo/' + this.$route.params.account + '/' + this.$route.params.employmentID + '/' + this.$route.params.brandID + '/' + this.$route.params.locate)
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
</style>