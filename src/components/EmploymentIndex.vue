<template>
    <div>
        <div class="weui_cells_title">&nbsp</div>
        <a class="weui_cell"  v-link="{path: 'employManagement/chooseEmployableRoles'}" >
            <div class="weui_cell_hd">
                <img  alt="头像" >
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
	</div>
</template>

<script>
    import agentInfo from '../api/agentInfo'
    import employment from '../api/employment'

    export default {
        data() {
            return {
                userinfo: {
                    brand_role: {
                        agent_brand_role: {
                            agent: {}
                        }
                    }
                },
                employableRolesList: []
            }
        },
        methods: {
            getPersonalInfo() {
                var that = this
                var user_account = window.state.userInfo.name
                console.log("获取用户账号:" + user_account)
                agentInfo.getBrandInfo({
                    user_account: user_account
                }).then(function(result) {
                    that.userinfo = result
                }).catch(function(err) {
                    window.alert(err)
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