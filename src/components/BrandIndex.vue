<template>
    <div>
        <p>用户账号： {{userinfo.brand_role.agent_brand_role.agent.user_account}}<p>
        <p>品牌名称： {{userinfo.name}}<p>
        <p>用户品牌角色： {{userinfo.brand_role.name}}<p>
		<group>
			<cell title="新代理加盟" value=">" inline-desc="查看或生成申请下级代理的分享链接"
                 @click="chooseBrandRole">
               <span class="demo-icon" slot="icon" style="color:#F70968">
                   <img src="../../static/TestIMG/店铺1头像.jpg"/>
               </span>
			</cell>
		</group>
        <div>
            <dialog :show.sync="showChooseBrandRoleModel" class="dialog-demo">
                <p class="dialog-title">选择新代理级别</p>
                <group>
                    <cell title="总代理" link="" ></cell>
                    <cell title="一级代理" link="" ></cell>
                    <cell title="二级代理" link="" ></cell>
                    <cell title="分销" link="" ></cell>
                </group>
                 <cell title="关闭" @click="showChooseBrandRoleModel=false" ></cell>
            </dialog>
        </div>
	</div>
</template>

<script>
    import {
        Cell,
        Group,
        Dialog
    } from 'vux'
    import agentInfo from '../api/agentInfo'
    import employment from '../api/employment'


    export default {
        props: {
            dialogTransition: {
                type: String,
                default: 'vux-dialog'
            },
        },
        components: {
            Cell,
            Group,
            Dialog
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
                showChooseBrandRoleModel:  false,
            }
        },
        methods:{
            chooseBrandRole() {
                var that = this
                console.log(that.userinfo.brand_role.code)
                employment.getEmployableRoles({brand_role_code: that.userinfo.brand_role.code
                }).then(function(result) {
                    console.log(result)
                })
                
                this.showChooseBrandRoleModel = true
            },
            getPersonalInfo(){
                var that = this
                //TODO： 通过Session 拿到登录时的账号
                var user_account = window.state.userInfo.name
                // var user_account = "bili"
                console.log("获取用户账号:" + user_account)
                agentInfo.getBrandInfo({user_account:user_account}).then(function(result) {
                    console.log(JSON.stringify(result))
                    that.userinfo = result
                }).catch(function(err) {
                    alert(err)
                    //TODO: 回到上一页
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