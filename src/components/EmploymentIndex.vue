<template>
    <div :show.sync="showEmploymentIndexModel">
        <div class="weui_panel weui_panel_access">
            <div class="weui_panel_hd" v-if="header" @click="onClickHeader" v-html="header"></div>
            <div class="weui_panel_bd">
                <a v-link="{ path: './chooseEmployableRoles' }" class="weui_media_box weui_media_appmsg">
                    <div class="weui_media_hd">
                        <img class="weui_media_appmsg_thumb" alt="头像">
                    </div>
                    <div class="weui_media_bd">
                        <h4 class="weui_media_title">发起招募</h4>
                        <p class="weui_media_desc">发起招募申请表</p>
                    </div>
                    <p>></p>
                </a>
            </div>
        </div>
	</div>
</template>

<script>
    import agentInfo from '../api/agentInfo'
    import employment from '../api/employment'


    export default {
        data() {
            return {
                userinfo:{
                    brand_role:{
                        agent_brand_role:{
                            agent:{}
                        }
                    }
                },
                employableRolesList:[],
                showEmploymentIndexModel: false,
            }
        },
        methods:{
            getPersonalInfo(){
                var that = this
                var user_account = window.state.userInfo.name
                console.log("获取用户账号:" + user_account)
                agentInfo.getBrandInfo({user_account:user_account}).then(function(result) {
                    that.userinfo = result
                    that.showEmploymentIndexModel = true
                }).catch(function(err) {
                    window.alert(err)
                })
            },
        },
        ready() {
            this.getPersonalInfo()
        }
    }
</script>
<style lang="less">
    img{
        width:50px;
        height:50px;
    }
</style>