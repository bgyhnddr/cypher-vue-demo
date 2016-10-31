<template>
	<div @keyup.enter="submitLogin">
			<div class="modal-body">
				<alert :type="alertType">
					{{alertText}}
				</alert>
				<div class="form-group">
					<label class="control-label">账号</label>
					<input v-el:account v-model="loginInfo.account" class="form-control"  type="text">
                </div>
				<bs-input :value.sync="loginInfo.password" label="密码" type="password"></bs-input>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-success" @click="submitLogin">登陆</button>
                <a class="btn btn-success" v-link="{ path: '/auth/regist' }">账户注册</a>
			</div>           
	</div>
</template>

<script>
    import {
        alert,
        input as bsInput
    } from 'vue-strap'
    require('bootstrap3/dist/css/bootstrap.css')
    import authAPI from '../api/auth'
    import VueRouter from 'vue-router'
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
            bsInput,
            alert
        },
        computed: {
            alertType() {
                return this.valid() ? "success" : "warning"
            },
            alertText() {
                if (this.serverMsg) {
                    return this.serverMsg;
                }
                let returnText = "请登陆";
                if (!this.loginInfo.account && !this.loginInfo.password) {
                    returnText = "请输入账号密码"
                } else if (!this.loginInfo.account) {
                    returnText = "请输入账号"
                } else if (!this.loginInfo.password) {
                    returnText = "请输入密码"
                } else {
                    return "请登录"
                }
                return returnText
            }
        },
        methods: {
            valid() {
                return this.loginInfo.account && this.loginInfo.password
            },
            submitLogin() {
                var that = this
                if (that.valid()) {
                    authAPI.login(that.loginInfo).then(function(result) {
                        that.state.userInfo = result
                        that.$route.router.go('/employManagement')
                        console.log(that.state.userInfo)
                    }).catch(function(err) {
                        console.log(err)
                        that.serverMsg = err
                    })
                }
            }
        },
        ready() {
            this.$els.account.focus()
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