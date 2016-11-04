<template>
    <div>
        <button class="weui_btn weui_btn_primary" :class="classes" v-for="role in employableRolesList"  
         v-link="{path: '/employManagement/brandAuthorization/'+userinfo.brand_role.agent_brand_role.agent.user_account
                    +'/'+role.employable_brand_role_code }">
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
                startTime: ""
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
                    if (typeof(result.name) == 'undefined') {
                        window.alert("获取用户登录信息失败，请重新登录")
                        that.$route.router.go('/auth/login')
                        return
                    }

                    var user_account = result.name
                    console.log("获取用户账号:" + user_account)

                    agentInfoAPI.getBrandInfo({
                        user_account: user_account
                    }).then(function(result) {
                        that.userinfo = result
                        that.chooseBrandRole()
                    }).catch(function(err) {
                        window.alert(err)
                    })
                })


            },
            createStartTime() {
                this.startTime = new Date().getTime()
                console.log(new Date(this.startTime))
            }
        },
        ready() {
            this.getPersonalInfo()
            this.createStartTime()
        }
    }
</script>