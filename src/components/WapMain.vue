<template>
	<div style="height:100%;">
		<loading :show="isLoading" position="absolute"></loading>
		<view-box v-ref:view-box>
			<!--header slot-->
			<div class="vux-demo-header-box" slot="header">
				<x-header :left-options="leftOptions" transition="headerTransition" :title="title" @on-click-title="scrollTop"></x-header>
			</div>
			<!--default slot-->
			<router-view  class="view" transition="fate" transition-mode="out-in"></router-view>
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

<style>
    html,
    body {
        height: 100%;
        width: 100%;
        overflow-x: hidden;
    }
    
    body {
        background-color: #fbf9fe;
    }
    
    .view {
        transition: all .3s ease;
    }
    
    .fate-enter,
    .fate-leave {
        opacity: 0;
        transform: translate3d(20px, 0, 0);
    }
</style>