<template>
    <div>
        <button class="weui_btn weui_btn_primary" :class="classes" v-for="role in employableRolesList"  
         v-link="{path: '/employManagement/brandAuthorization/'+userinfo.brand_role.agent_brand_role.agent.user_account
                    +'/'+role.employable_brand_role_code + '/' + brandName}">
            {{role.brand_role.name}}
        </button>
    </div>
</template>

<script>
    import authAPI from '../api/auth'
    import agentInfoAPI from '../api/agentInfo'
    import employmentAPI from '../api/employment'

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
                employableRolesList: [],
                brandName: "",
            }
        },
        methods: {
            chooseBrandRole() {
                var that = this
                console.log(that.userinfo.brand_role.code)
                employmentAPI.getEmployableRoles({
                    brand_role_code: that.userinfo.brand_role.code
                }).then(function(result) {
                    if (result.roleCount == 0) {
                        console.log("找不到你可以招募的级别")
                    } else {
                        that.employableRolesList = result.employableRoles
                    }
                })
            },
            getPersonalInfo() {
                var that = this
                authAPI.getUser().then(function(result) {

                    var user_account = result.name
                    console.log("获取用户账号:" + user_account)

                    agentInfoAPI.getBrandInfo({
                        user_account: user_account
                    }).then(function(result) {
                        console.log(result.name)
                        that.brandName = result.name
                        that.userinfo = result
                        that.chooseBrandRole()
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