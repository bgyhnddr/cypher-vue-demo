<template>
    <div>
<div class="My-account">
        <group>
            <!--我的证书-->
            <a class="weui_cell" v-link="{path: '/accountManagement/MyCertificate/'+this.user.user_info.name+'/account'}" >
                <div class="weui_cell_hd">
                    <img src="/static/TestIMG/certificate.png" >
                </div>
                <div class="weui_cell_bd weui_cell_primary">
                    <p>我的证书</p>
                </div>
                <div class="weui_cell_ft" :class="{'with_arrow': true}">
                    <slot name="value"></slot>
                    <slot></slot>
                </div>
            </a>
            <!--修改密码-->
            <a class="weui_cell"  v-link="{path: '/auth/changepwd'}" >
                <div class="weui_cell_hd">
                  <img src="/static/TestIMG/ModifyThePassword.png" >
                </div>
                <div class="weui_cell_bd weui_cell_primary">
                    <p>修改密码</p>
                </div>
                <div class="weui_cell_ft" :class="{'with_arrow': true}">
                    <slot name="value"></slot>
                    <slot></slot>
                </div>
            </a>
            <!--修改手机号-->
            <a class="weui_cell"  v-link="" >
                <div class="weui_cell_hd">
                   <img src="/static/TestIMG/ModifyThePhone.png" >
                </div>
                <div class="weui_cell_bd weui_cell_primary">
                    <p>修改手机号</p>
                </div>
                <div class="weui_cell_ft" :class="{'with_arrow': true}">
                    <slot name="value"></slot>
                    <slot></slot>
                </div>
            </a>
            <!--修改微信号-->
            <a class="weui_cell"  v-link="" >
                <div class="weui_cell_hd">
                  <img src="/static/TestIMG/ModifyTheWeixin.png" >
                </div>
                <div class="weui_cell_bd weui_cell_primary">
                    <p>修改微信号</p>
                </div>
                <div class="weui_cell_ft" :class="{'with_arrow': true}">
                    <slot name="value"></slot>
                    <slot></slot>
                </div>
            </a>
        </group>
	</div></div>
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
                    that.user.user_info = result
                    console.log("用户账号:" + that.user.user_info.name)

                    agentInfoAPI.getBrandRoleInfo({
                        user_account: that.user.user_info.name
                    }).then(function(result) {
                        console.log(JSON.stringify(result))
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
  .My-account{
margin-top: 2%;
}
  .My-account  .weui_cell{
 background: #fff;
    margin-top: 1%;
    padding: 1% 5%;
    border-top:0!important;
    font-size: 15px;
    font-family: "微软雅黑";
   }
  .My-account img{width: 77%;} 
  .My-account .weui_cell:before {
 border-top:0!important


 }

</style>