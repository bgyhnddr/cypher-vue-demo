<template>
	<div style="overflow-x: hidden;">
		<loading :show="isLoading" position="absolute"></loading>
		<view-box v-ref:view-box>
			<!--header slot-->
			<div class="vux-demo-header-box" slot="header">
				<x-header :left-options="leftOptions" transition="headerTransition" :title="title" @on-click-title="scrollTop"></x-header>
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
                    showBack: false
                }
            }
        },
        computed: {
            title() {
                if (this.$route.path === '/index')
                    return 'Home'
                if (this.$route.path === '/example2')
                    return 'example2'
            }
        },
        methods: {
            scrollTop() {
                this.$refs.viewBox.$els.viewBoxBody.scrollTop = 0
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