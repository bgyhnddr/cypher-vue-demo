<template>
	<div @keyup.enter="UserRegist">
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
					<input v-el:account v-model="loginInfo.password" class="form-control"  type="password">
                </div>
                <div class="form-group">
					<label class="control-label">再次输入密码</label>
					<input v-el:password v-model="loginInfo.insurepwd" class="form-control"  type="password">
                </div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-success" @click="UserRegist">注册</button>
                <a class="btn btn-success" v-link="{ path: '/auth/login' }">返回登录</a>
			</div>
            <div>
                <toast :show.sync="show" :time="1000" @on-hide="onHide">注册成功</toast>     
            </div>             
	</div>
</template>

<script>
    import authAPI from '../api/auth'
    import VueRouter from 'vue-router'
    import { Toast, Group } from 'vux'
    export default {
        data() {
            return {
                show: false,
                state: window.state,
                serverMsg: "",
                loginInfo: {
                    account: "",
                    password: "",
                    insurepwd:""
                }
            }
        },
        components: {
            Toast,
            Group
        },
        computed: {
            alertText() {
                if (this.serverMsg) {
                    return this.serverMsg;
                }
                let returnText = "注册";
                if (!this.loginInfo.account && !this.loginInfo.password) {
                    returnText = "请输入账号密码"
                } else if (!this.loginInfo.account) {
                    returnText = "请输入账号"
                } else if (!this.loginInfo.password && !this.loginInfo.insurepwd) {
                    returnText = "请输入密码"
                } else if (this.loginInfo.password != this.loginInfo.insurepwd) {
                    returnText = "密码不一致"
                } else {
                    return "注册"
                }
                return returnText
            }
        },
        methods: {
            valid() {
                return this.loginInfo.account && this.loginInfo.password == this.loginInfo.insurepwd
            },
            onHide() {
                const router = new VueRouter()
                router.go('login')
            },
            UserRegist(){
                var that = this
                if(that.valid()){
                    authAPI.regist(that.loginInfo).then(function(result){                   
                        that.show = true                      
                    }).catch(function(err){
                        console.log(err)
                        that.serverMsg = err
                    })
                }
            }
         },
        ready() {
            // this.$els.account.focus()
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