<template>
    <div>
        <p>用户账号： {{user.account}}<p>
        <p>用户角色： {{user.brand_role_name}}<p>
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
                user: {
                    account: "",
                    headIMG: "",
                    brand_role_name:"",
                },
                showChooseBrandRoleModel:  false,
            }
        },
        methods:{
            getAccount(){
                this.user.account = "bili"
            },
            chooseBrandRole() {
                brand_role

                this.showChooseBrandRoleModel = true
            },
            getPersonalInfo(){
                var that = this
                this.user.account = "bili"
                console.log("获取用户账号")
                agentInfo.getBrandInfo({user_account:this.user.account}).then(function(result) {
                    console.log(JSON.stringify(result))
                    that.user.brand_role_name = result.name
                }).catch(function(err) {
                    alert(err)
                    //回到上一页
                })
            },
        },
        ready() {
            //TODO： 通过Session 拿到登录时的账号
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