<template>
	<div @keyup.enter="ChangePwd">
			<div>
                <group>
                    <x-input title="旧密码" :value.sync="pwd.old_password" type="password" name="username" placeholder="请输入旧密码" is-type="china-name"></x-input>
                </group>
                <group>
                    <!--<x-input title="请输入6位数字" type="text" placeholder="" :value.sync="password" :min="6" :max="6" @on-change="change"></x-input>-->
                    <x-input title="新密码" :value.sync="pwd.new_password" type="password" placeholder="请输入新密码" :equal-with="password"></x-input>
                </group>
                <group>
                    <!--<x-input title="请输入6位数字" type="text" placeholder="" :value.sync="password" :min="6" :max="6" @on-change="change"></x-input>-->
                    <x-input title="再次确认新密码" :value.sync="pwd.insure_password" type="password" placeholder="再次确认新密码" :equal-with="password"></x-input>
                </group>               
			</div>
            <flexbox style="margin-top:20px">
                <flexbox-item>
                    <x-button type="primary" @click="ChangePwd">确认修改</x-button>
                </flexbox-item>
            </flexbox> 
            <div>
                <toast :show.sync="show" :time="1000" @on-hide="onHide">修改成功</toast>     
            </div>  
	</div>
</template>

<script>
    import authAPI from '../api/auth'
    import VueRouter from 'vue-router'
    import { Toast,XInput, Group, XButton,Flexbox,FlexboxItem } from 'vux'
    export default {
        data() {
            return {
                show: false,
                state: window.state,
                serverMsg: "",
                pwd: {
                    old_password: "",
                    new_password: "",
                    insure_password:""
                }
            }
        },
        components: {
            Toast,
            Group,
            XInput,
            XButton,
            Flexbox,
            FlexboxItem
        },
        methods: {
            valid() {
                 return this.pwd.old_password && this.pwd.new_password == this.pwd.insure_password
            },
            onHide() {

            },
            ChangePwd(){
                var that = this
                if(that.valid()){
                    authAPI.changeuserpwd(that.pwd).then(function(result){
                        that.show = true
                        console.log("success")
                    }).catch(function(err){
                        console.log(err)
                        that.serverMsg = err
                    })
                }
            }
        },
        ready() {
            //this.$els.pwd.focus()
        }
    }
</script>
<style>
    .login_zindex {
        z-index: 10000000 !important;
    }
    
    .login_loading_zindex {
        z-index: 10000001 !important;
    }
</style>