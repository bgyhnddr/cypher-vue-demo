<template>
    <div style="overflow-x: hidden;">
        <loading :show="isLoading" position="absolute"></loading>
        <view-box v-ref:view-box>
            <!--header slot-->
            <div class="vux-demo-header-box" slot="header">
                <x-header :left-options="leftOptions" transition="headerTransition" :title="title" @on-click-title="scrollTop"></x-header>
                <div slot="left">
                    <button v-if="ShowBack" @click="onClickBack">返回</button>
                </div>
            </div>
            <!--default slot-->
            <router-view class="view" transition="fate" transition-mode="out-in"></router-view>
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
                ShowBack: false
            }
        },
        computed: {
            title() {
                if (this.$route.path === '/index') {
                    this.ShowBack = false
                    return 'Home'
                } else if (this.$route.path === '/auth/login') {
                    document.body.style.background = '#fff'
                    this.ShowBack = false
                    return '登录'
                } else if (this.$route.path === '/auth/changepwd') {
                    this.ShowBack = true
                    return '修改密码'
                } else if (this.$route.path === '/homePage') {
                    this.ShowBack = false
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
                    this.ShowBack = true
                    this.$on('fillInEmployment_goBack', function(flag) {
                        console.log("event" + "==========" + flag)
                        this.leftOptions.showBack = flag
                    })
                    return this.$route.params.brandName + "——代理授权申请"
                } else if (this.$route.name === 'EmploymentSubmission') {
                    this.ShowBack = false
                    return this.$route.params.brandName + "——代理授权申请"
                } else if (this.$route.path === '/employManagement/audit') {
                    this.ShowBack = true
                    return '资料审核'
                } else if (this.$route.name === 'AuditInfo') {
                    this.ShowBack = true
                    if (this.$route.params.locate == 'audit') {
                        return '审核详情'
                    } else if (this.$route.params.locate == 'history') {
                        return '招募详情'
                    }
                } else if (this.$route.path === '/employManagement/employmentHistory') {
                    this.ShowBack = true
                    return '招募历史'
                } else if (this.$route.path === '/accountManagement') {
                    this.ShowBack = true
                    return '我的账号'
                } else if (this.$route.name === 'MyCertificate') {
                    this.ShowBack = true
                    return '我的证书'
                } else if (this.$route.name === 'CertificateInfo') {
                    this.ShowBack = true
                    return 'adminBrand'
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
                    }
                } else if (FirstPath == "homePage") {
                    if (SecPath == "search") {
                        this.$route.router.go('/homePage')
                        return
                    }
                } else if (FirstPath == "employManagement") {
                    if (!SecPath) {
                        this.$route.router.go('/homePage')
                        return
                    } else if (SecPath == "chooseEmployableRoles") {
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
                        this.$route.router.go('/employManagement/audit')
                        return
                    } else if (SecPath == "employmentHistory") {
                        this.$route.router.go('/employManagement')
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
                        history.back()
                        return
                    }
                }
            },
        },
    }
</script>
<style lang="less">
    html,
    body {
        height: 100%;
        width: 100%;
        overflow-x: hidden;
    }
    
    body {
        background-color: #fbf9fe;
    }
    /* v-r-transition, default is {forward: 'forward', back: 'back'}*/
    
    .forward-enter,
    .forward-leave {
        transform: translate3d(-100%, 0, 0);
    }
    
    .back-enter,
    .back-leave {
        transform: translate3d(100%, 0, 0);
    }
    
    .demo-icon-22 {
        font-family: 'vux-demo';
        font-size: 22px;
        color: #888;
    }
    
    .weui_tabbar.vux-demo-tabbar {
        backdrop-filter: blur(10px);
        background-color: none;
        background: rgba(247, 247, 250, 0.5);
    }
    
    .vux-demo-tabbar .weui_bar_item_on .demo-icon-22 {
        color: #F70968;
    }
    
    .vux-demo-tabbar .weui_tabbar_item.weui_bar_item_on .weui_tabbar_label {
        color: #35495e;
    }
    
    .vux-demo-tabbar .weui_tabbar_item.weui_bar_item_on .vux-demo-tabbar-icon-home {
        color: rgb(53, 73, 94);
    }
    
    .demo-icon-22:before {
        content: attr(icon);
    }
    
    .vux-demo-tabbar-component {
        background-color: #F70968;
        color: #fff;
        border-radius: 7px;
        padding: 0 4px;
        line-height: 14px;
    }
    
    .weui_tabbar_icon+.weui_tabbar_label {
        margin-top: 0!important;
    }
    
    .vux-demo-header-box {
        z-index: 100;
        position: absolute;
        width: 100%;
        left: 0;
        top: 0;
    }
    
    .weui_tab_bd {
        padding-top: 46px;
    }
    /**
* vue-router transition
*/
    
    .vux-pop-out-transition,
    .vux-pop-in-transition {
        width: 100%;
        animation-duration: 0.5s;
        animation-fill-mode: both;
        backface-visibility: hidden;
    }
    
    .vux-pop-out-enter,
    .vux-pop-out-leave,
    .vux-pop-in-enter,
    .vux-pop-in-leave {
        will-change: transform;
        height: 100%;
        position: absolute;
        left: 0;
    }
    
    .vux-pop-out-enter {
        animation-name: popInLeft;
    }
    
    .vux-pop-out-leave {
        animation-name: popOutRight;
    }
    
    .vux-pop-in-enter {
        perspective: 1000;
        animation-name: popInRight;
    }
    
    .vux-pop-in-leave {
        animation-name: popOutLeft;
    }
    
    @keyframes popInLeft {
        from {
            transform: translate3d(-100%, 0, 0);
        }
        to {
            transform: translate3d(0, 0, 0);
        }
    }
    
    @keyframes popOutLeft {
        from {
            transform: translate3d(0, 0, 0);
        }
        to {
            transform: translate3d(-100%, 0, 0);
        }
    }
    
    @keyframes popInRight {
        from {
            transform: translate3d(100%, 0, 0);
        }
        to {
            transform: translate3d(0, 0, 0);
        }
    }
    
    @keyframes popOutRight {
        from {
            transform: translate3d(0, 0, 0);
        }
        to {
            transform: translate3d(100%, 0, 0);
        }
    }
    
    .view {
        transition: all .3s ease;
    }
    
    .fate-enter,
    .fate-leave {
        opacity: 0;
    }
</style>