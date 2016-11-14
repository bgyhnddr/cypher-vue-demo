<template>
<div>
    <div class="choose-bac">
        <button class="weui_btn weui_btn_primary" :class="classes" v-for="role in employableRolesList" @click="chooseRole(role.employable_brand_role_code)">
            {{role.brand_role.name}}
        </button>
    </div>
    <alert :show.sync="showMsg" button-text="确认">{{errorMsg}}</alert>
</div>
</template>

<script>
    import {
        Alert
    } from 'vux'
    import authAPI from '../api/auth'
    import agentInfoAPI from '../api/agentInfo'
    import employmentAPI from '../api/employment'

    export default {
        components: {
            Alert
        },
        data() {
            return {
                userinfo: {
                    brand_role: {
                        agent_brand_role: {
                            agent: {}
                        }
                    }
                },
                employableRolesList: [],
                brandName: "",
                showMsg: false,
                errorMsg: null
            }
        },
        methods: {
            chooseBrandRole() {
                var that = this
                console.log("招募者的角色" + that.userinfo.brand_role.code)
                employmentAPI.getEmployableRoles({
                    brand_role_code: that.userinfo.brand_role.code
                }).then(function(result) {
                    if (result.roleCount == 0) {
                        that.showMsg = true
                        that.errorMsg = "找不到您可以招募的级别"
                    } else {
                        that.employableRolesList = result.employableRoles
                    }
                }).catch(function(err) {
                    that.showMsg = true
                    that.errorMsg = err
                })
            },
            getPersonalInfo() {
                var that = this
                authAPI.getUser().then(function(result) {

                    var user_account = result.name
                    console.log("获取用户账号:" + user_account)

                    agentInfoAPI.getBrandRoleInfo({
                        user_account: user_account
                    }).then(function(result) {
                        console.log(JSON.stringify(result))
                        that.brandName = result.name
                        that.userinfo = result
                        that.chooseBrandRole()
                    }).catch(function(err) {
                        that.showMsg = true
                        that.errorMsg = err
                    })
                })
            },

            chooseRole(roleCode) {
                //创建发起招募
                var that = this
                console.log(roleCode)
                var employer = this.userinfo.brand_role.agent_brand_role.agent.user_account
                var brandGuid = this.userinfo.brand_role.brand_guid


                employmentAPI.createEmployment({
                    employer: employer,
                    brandGuid: brandGuid,
                    roleCode: roleCode,
                    createTime: new Date().Format('yyyy-MM-dd hh:mm:ss')
                }).then(function(result) {
                    console.log(JSON.stringify(result))
                        //跳转证书页
                    that.$route.router.go('/employManagement/brandAuthorization/' + result)
                }).catch(function(err) {
                    that.showMsg = true
                    that.errorMsg = err
                    that.$route.router.go('/employManagement')
                })

            },
        },
        ready() {
            this.getPersonalInfo()
        }
    }
</script>
<style lang="less">
    .choose-bac {
        margin-top: 7%;
    }
    
    .choose-bac .weui_btn+.weui_btn {
        margin-top: 7px;
    }
    
    .choose-bac button.weui_btn.weui_btn_primary {
        width: 89%;
        line-height: 2.2;
        background: #3970aa;
        font-size: 17px;
        border-radius: 3px;
        font-family: "微软雅黑";
    }
</style>