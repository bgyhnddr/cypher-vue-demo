<template>
    <div>
        <group>
            <!--发起招募-->
            <a class="weui_cell"  v-link="{path: 'employManagement/chooseEmployableRoles'}" >
                <div class="weui_cell_hd">
                    <img  alt="图标LOGO" >
                </div>
                <div class="weui_cell_bd weui_cell_primary">
                    <p>发起招募</p>
                    <p>发起招募申请表</p>
                </div>
                <div class="weui_cell_ft" :class="{'with_arrow': true}">
                    <slot name="value"></slot>
                    <slot></slot>
                </div>
            </a>
            <!--当前招募-->
            <a class="weui_cell"  v-link="" >
                <div class="weui_cell_hd">
                    <img  alt="图标LOGO" >
                </div>
                <div class="weui_cell_bd weui_cell_primary">
                    <p>当前招募</p>
                    <p>查看当前进行的招募状态</p>
                </div>
                <div class="weui_cell_ft" :class="{'with_arrow': true}">
                    <slot name="value"></slot>
                    <slot></slot>
                </div>
            </a>
            <!--成员审核-->
            <a class="weui_cell"  v-link="" >
                <div class="weui_cell_hd">
                    <img  alt="图标LOGO" >
                </div>
                <div class="weui_cell_bd weui_cell_primary">
                    <p>成员审核</p>
                    <p>审核新代理申请表</p>
                </div>
                <div class="weui_cell_ft" :class="{'with_arrow': true}">
                    <slot name="value"></slot>
                    <slot></slot>
                </div>
            </a>
            <!--招募历史-->
            <a class="weui_cell"  v-link="" >
                <div class="weui_cell_hd">
                    <img  alt="图标LOGO" >
                </div>
                <div class="weui_cell_bd weui_cell_primary">
                    <p>招募历史</p>
                    <p>查看已成功招募信息</p>
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