<template>
    <div>
        <group>
            <!--我的证书-->
            <a class="weui_cell"  v-link="" >
                <div class="weui_cell_hd">
                    <img  alt="图标LOGO" >
                </div>
                <div class="weui_cell_bd weui_cell_primary">
                    <p>我的证书</p>
                </div>
                <div class="weui_cell_ft" :class="{'with_arrow': true}">
                    <slot name="value"></slot>
                    <slot></slot>
                </div>
            </a>
            <!--修改密码-->
            <a class="weui_cell"  v-link="{path: 'auth/changepwd'}" >
                <div class="weui_cell_hd">
                    <img  alt="图标LOGO" >
                </div>
                <div class="weui_cell_bd weui_cell_primary">
                    <p>修改密码</p>
                </div>
                <div class="weui_cell_ft" :class="{'with_arrow': true}">
                    <slot name="value"></slot>
                    <slot></slot>
                </div>
            </a>
            <!--修改手机号-->
            <a class="weui_cell"  v-link="" >
                <div class="weui_cell_hd">
                    <img  alt="图标LOGO" >
                </div>
                <div class="weui_cell_bd weui_cell_primary">
                    <p>修改手机号</p>
                </div>
                <div class="weui_cell_ft" :class="{'with_arrow': true}">
                    <slot name="value"></slot>
                    <slot></slot>
                </div>
            </a>
            <!--修改微信号-->
            <a class="weui_cell"  v-link="" >
                <div class="weui_cell_hd">
                    <img  alt="图标LOGO" >
                </div>
                <div class="weui_cell_bd weui_cell_primary">
                    <p>修改微信号</p>
                </div>
                <div class="weui_cell_ft" :class="{'with_arrow': true}">
                    <slot name="value"></slot>
                    <slot></slot>
                </div>
            </a>
        </group>
	</div>
</template>

<script>
    import {
        Group
    } from 'vux'
    import authAPI from '../api/auth'
    import agentInfoAPI from '../api/agentInfo'

    export default {
        components: {
            Group
        },
        data() {
            return {
                user: {
                    user_info: {},
                    brand_info: {
                        brand_role: {
                            agent_brand_role: {
                                agent: {}
                            }
                        }
                    }
                }
            }
        },
        methods: {
            getPersonalInfo() {
                var that = this
                authAPI.getUser().then(function(result) {
                    if (typeof(result.name) == 'undefined') {
                        window.alert("获取用户登录信息失败，请重新登录")
                        that.$route.router.go('/auth/login')
                        return
                    }

                    that.user.user_info = result
                    console.log("用户账号:" + that.user.user_info.name)

                    agentInfoAPI.getBrandInfo({
                        user_account: that.user.user_info.name
                    }).then(function(result) {
                        that.user.brand_info = result
                    }).catch(function(err) {
                        window.alert(err)
                    })
                })
            }
        },
        ready() {
            this.getPersonalInfo()
        }
    }
</script>
<style lang="less">
    img {
        width: 50px;
        height: 50px;
    }
</style>