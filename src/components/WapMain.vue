<template>
    <div style="overflow-x: hidden;">
        <loading :show="isLoading" position="absolute"></loading>
        <view-box v-ref:view-box>
            <!--header slot-->
            <div class="vux-demo-header-box" slot="header">
                <x-header :left-options="leftOptions" transition="headerTransition" :title="title" @on-click-title="scrollTop" @click="onClickBack"></x-header>
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
                    showBack: true,
                    backText: '返回',
                    preventGoBack: false
                }
            }
        },
        computed: {
            title() {
                if (this.$route.path === '/index')
                    return 'Home'
                if (this.$route.path === '/example2')
                    return 'example2'
                if (this.$route.path === '/auth/login')
                    return '登录'
                if (this.$route.path === '/auth/regist')
                    return '注册'
                if (this.$route.path === '/auth/changepwd')
                    return '修改密码'
                if (this.$route.path === '/auth/test')
                    return '测试页面'
                if (this.$route.path === '/employManagement')
                    return '成员招募'
                if (this.$route.path === '/employManagement/chooseEmployableRoles')
                    return '选择招募代理级别'
                if (this.$route.name === 'BrandAuthorization') {
                    console.log(this.$route.params.account)
                    return this.$route.params.brandName
                }
                if (this.$route.name === 'FillInEmployment') {
                    this.leftOptions.showBack = false
                    this.$on('fillInEmployment_goBack', function(flag) {
                        console.log("event" + "==========" + flag)
                        this.leftOptions.showBack = flag
                    })
                    return this.$route.params.brandName + "——代理授权申请"
                }
                if (this.$route.name === 'EmploymentSubmission') {
                    this.leftOptions.showBack = false
                    return this.$route.params.brandName + "——代理授权申请"
                }
                if (this.$route.path === '/employManagement/audit')
                    return '资料审核'
                if (this.$route.path === '/employManagement/auditInfo')
                    return '审核详情'
                if (this.$route.path === '/employManagement/employmentHistory')
                    return '招募历史'
                if (this.$route.path === '/accountManagement')
                    return '我的账号'
            }
        },
        methods: {
            scrollTop() {
                this.$refs.viewBox.$els.viewBoxBody.scrollTop = 0
            },
            onClickBack() {
                if (this.leftOptions.preventGoBack) {
                    this.$emit('on-click-back')
                } else {
                    if (this.$route.path === '/index') {
                        this.leftOptions.showBack = false
                        return
                    }
                    if (this.$route.path === '/auth/login') {
                        this.leftOptions.showBack = false
                        return
                    }
                    if (this.$route.path === '/employManagement') {
                        history.back()
                    }
                    if (this.$route.path === '/employManagement/chooseEmployableRoles') {
                        this.$route.router.go('/employManagement')
                        return
                    }
                    if (this.$route.name === 'FillInEmployment') {
                        this.$broadcast('goFillEmployment1')
                        return
                    }
                    if (this.$route.name === 'BrandAuthorization') {
                        this.$route.router.go('/employManagement/chooseEmployableRoles')
                        return
                    }
                    if (this.$route.name === 'EmploymentSubmission') {
                        this.leftOptions.showBack = false
                        return
                    }
                }
            }
        }
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