<template>
    <div>
        <group v-else>
            <cell v-for="role in employableRolesList" :title="role.brand_role.name" v-link="{path: './brandAuthorization',query: { 
            employerAccount: userinfo.brand_role.agent_brand_role.agent.user_account,
            employeeRole: role.brand_role.name
            }}"></cell>
        </group>
    </div>
</template>

<script>
    import {
        Cell,
        Group
    } from 'vux'
    import agentInfo from '../api/agentInfo'
    import employment from '../api/employment'


    export default {
        components: {
            Cell,
            Group,
        },
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
                link:""
            }
        },
        methods:{
            chooseBrandRole() {
                var that = this
                console.log(that.userinfo.brand_role.code)
                employment.getEmployableRoles({brand_role_code: that.userinfo.brand_role.code
                }).then(function(result) {                                                                                                                                                                                                                                                                                                                                                                             
                    console.log(JSON.stringify(result))
                    if(result.roleCount == 0){
                        console.log("找不到你可以招募的级别")
                    }else{
                        that.employableRolesList = result.employableRoles
                    }
                })
            },
            getPersonalInfo(){
                var that = this
                var user_account = window.state.userInfo.name
                console.log("获取用户账号:" + user_account)
                agentInfo.getBrandInfo({user_account:user_account}).then(function(result) {
                    that.userinfo = result
                    // console.log("用户账号=" + that.userinfo.brand_role.agent_brand_role.agent.user_account +
                    //             "品牌名称=" + that.userinfo.name +
                    //             "用户品牌角色=" + that.userinfo.brand_role.name)
                    that.chooseBrandRole()
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