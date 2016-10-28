<template>
	<div @keyup.enter="UserRegist">
			<div class="modal-body">
				<alert :type="alertType">
					{{alertText}}
				</alert>
				<div class="form-group">
					<label class="control-label">账号</label>
					<input v-el:account v-model="loginInfo.account" class="form-control"  type="text">
                </div>
				<bs-input :value.sync="loginInfo.password" label="密码" type="password"></bs-input>
                <bs-input :value.sync="loginInfo.insurepwd" label="再次输入密码" type="password"></bs-input>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-success" @click="UserRegist">注册</button>
                <a class="btn btn-success" v-link="{ path: '/login' }">返回登录</a>
			</div>
            <!--<div>
                <confirm :show.sync="show" title="confirm deleting the item" @on-cancel="onCancel" @on-confirm="onConfirm" @on-show="onShow"
                    @on-hide="onHide">
                    <p style="text-align:center;">Are you sure?</p>
                </confirm>
            </div>-->
            <!--<div class="weui_mask vux-fade-transition" style=""></div>-->
            <modal :show.sync="show" effect="fade" width="400" class="vux-center">
                <div slot="modal-body" class="modal-body">注册成功</div>
                <div slot="modal-footer" class="modal-footer">
                    <a class="btn btn-success" v-link="{ path: '/login' }">确定</a>
                </div>
            </modal>
            <!--<alert :show.sync="show" class="weui_dialog vux-dialog-transition">
                <div>Message is sent successfully~</div>
                <div><a class="btn btn-success" v-link="{ path: '/login' }">确定</a></div>
            </alert>-->
                
	</div>
</template>

<script>
    import {
        modal,
        alert,
        input as bsInput
    } from 'vue-strap'
    import authAPI from '../api/auth'
    import VueRouter from 'vue-router'
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
            bsInput,
            alert,
            modal
        },
        computed: {
            alertType() {
                return this.valid() ? "success" : "warning"
            },
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
            UserRegist(){
                var that = this
                if(that.valid()){
                    authAPI.regist(that.loginInfo).then(function(result){
                        //that.$vux.vux_alert.show({ content: '注册成功！' })
                        const router = new VueRouter()
                        that.show = true
                        //router.go('login')                        
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