<template>
<div>
    <div class="choose-bac">
        <button class="weui_btn weui_btn_primary" :class="classes" v-for="role in employableRolesList" @click="chooseRole(role.employable_brand_role_code)">
            {{role.brand_role.name}}
        </button>
    </div>
    <alert :show.sync="showMsg" button-text="确认">{{errorMsg}}</alert>
    <alert :show.sync="showCatchError" button-text="确认" @on-hide="onHide">{{catchErrorMsg}}</alert>
</div>
  <div class="all-footer">© 2016 ShareWin.me 粤ICP备14056388号</div>
</template>

<script>
    import {
        Alert
    } from 'vux'
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
                errorMsg: null,
                showCatchError: false,
                catchErrorMsg: null
            }
        },
        methods: {
            chooseBrandRole() {
                var that = this
                employmentAPI.getEmployableRoles({
                    brand_role_code: that.userinfo.brand_role.code
                }).then(function(result) {
                    if (result.length == 0) {
                        that.showMsg = true
                        that.errorMsg = "您目前暂无可招募代理角色"
                    } else {
                        that.employableRolesList = result
                    }
                }).catch(function(err) {
                    that.showCatchError = true
                    that.catchErrorMsg = err
                })
            },
            getPersonalInfo() {
                var that = this
                agentInfoAPI.getBrandRoleInfo().then(function(result) {
                    that.brandName = result.name
                    that.userinfo = result
                    that.chooseBrandRole()
                }).catch(function(err) {
                    that.showCatchError = true
                    that.catchErrorMsg = err
                })
            },
            chooseRole(roleCode) {
                //创建发起招募
                var that = this
                var employer = this.userinfo.brand_role.agent_brand_role.agent.user_account
                var brandGuid = this.userinfo.brand_role.brand_guid

                employmentAPI.createEmployment({
                    employer: employer,
                    brandGuid: brandGuid,
                    roleCode: roleCode,
                    createTime: new Date().Format('yyyy-MM-dd hh:mm:ss')
                }).then(function(result) {
                        //跳转证书页
                    that.$route.router.go('/employManagement/brandAuthorization/' + result)
                }).catch(function(err) {
                    that.showCatchError = true
                    that.catchErrorMsg = err
                })

            },
            onHide() {
              this.$route.router.go('/employManagement')
            }
        },
        ready() {
            this.getPersonalInfo()
        }
    }
</script>
<style lang="less">
    .choose-bac {
        margin-top: 7%;
        min-height: 460px;
    }

    .choose-bac .weui_btn+.weui_btn {
        margin-top: 7px;
    }

    .choose-bac button.weui_btn.weui_btn_primary {
        width: 89%;
        line-height: 2.2;
        background: #3970aa;
        font-size: 5.2vw;/*17px*/
        border-radius: 3px;
        font-family: "微软雅黑";
    }
</style>
