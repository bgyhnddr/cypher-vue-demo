<template>
	<div @keyup.enter="submitLogin">
			<div>
                <group>
                    <x-input title="账号" :value.sync="loginInfo.account" name="username" placeholder="请输入姓名" is-type="china-name"></x-input>
                </group>
                <group>
                    <!--<x-input title="请输入6位数字" type="text" placeholder="" :value.sync="password" :min="6" :max="6" @on-change="change"></x-input>-->
                    <x-input title="密码" :value.sync="loginInfo.password" type="password" placeholder="请输入密码" :equal-with="password"></x-input>
                </group>
			</div>
            <flexbox style="margin-top:20px">
                <flexbox-item>
                    <x-button type="primary" @click="submitLogin">登陆</x-button>
                </flexbox-item>
                <flexbox-item>
                    <x-button type="warn" v-link="{ path: '/auth/regist' }">账户注册</x-button>
                </flexbox-item>
            </flexbox>         
	</div>
</template>

<script>
    import authAPI from '../api/auth'
    import VueRouter from 'vue-router'
    import { XInput, Group, XButton,Flexbox,FlexboxItem } from 'vux'
    export default {
        data() {
            return {
                state: window.state,
                serverMsg: "",
                loginInfo: {
                    account: "",
                    password: ""
                }
            }
        },
        components: {
            XInput,
            Group,
            XButton,
            Flexbox,
            FlexboxItem
        },
        methods: {
            valid() {
                return this.loginInfo.account && this.loginInfo.password
            },
            submitLogin() {
                var that = this
                if (that.valid()) {
                    authAPI.login(that.loginInfo).then(function(result) {
                        const router = new VueRouter()
                        router.go('admin/EmploymentIndex')
                        that.state.userInfo = result
                        console.log(that.state.userInfo)
                    }).catch(function(err) {
                        console.log(err)
                        that.serverMsg = err
                    })
                }
            }
        },
        ready() {
            //this.$els.account.focus()
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