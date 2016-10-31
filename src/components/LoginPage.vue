<template>
	<div @keyup.enter="submitLogin">
			<div class="modal-body">
				<p>
					{{alertText}}
				</p>
				<div class="form-group">
					<label class="control-label">账号</label>
					<input v-el:account v-model="loginInfo.account" class="form-control"  type="text">
                </div>
                <div class="form-group">
					<label class="control-label">密码</label>
					<input v-el:password v-model="loginInfo.password" class="form-control"  type="password">
                </div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-success" @click="submitLogin">登陆</button>
                <a class="btn btn-success" v-link="{ path: '/auth/regist' }">账户注册</a>
			</div>           
	</div>
</template>

<script>
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
        },
        computed: {
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