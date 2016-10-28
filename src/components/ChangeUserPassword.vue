<template>
	<div @keyup.enter="ChangePwd">
			<div class="modal-body">
				<alert :type="alertType">
					{{alertText}}
				</alert>
                <div class="form-group">
					<label class="control-label">旧密码</label>
					<input v-el:pwd v-model="pwd.old_password" class="form-control"  type="password">
                </div>               
                <!--<bs-input v-el:pwd :value.sync="pwd.old_password" label="旧密码" type="password"></bs-input>-->
				<bs-input :value.sync="pwd.new_password" label="新密码" type="password"></bs-input>
                <bs-input :value.sync="pwd.insure_password" label="再次输入新密码" type="password"></bs-input>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-success" @click="ChangePwd">确认修改</button>
                <!--<a class="btn btn-success" v-link="{ path: '/index' }">返回</a>-->
			</div>
            <modal :show.sync="show" effect="fade" width="400" class="vux-center">
                <div slot="modal-body" class="modal-body">修改成功</div>
                <div slot="modal-footer" class="modal-footer">
                    <button type="button" class="btn btn-success" @click="show=false">确定</button>
                    <!--<a class="btn btn-success" v-link="{ path: '/login' }">确定</a>-->
                </div>
            </modal>
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
                pwd: {
                    old_password: "",
                    new_password: "",
                    insure_password:""
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
                if (!this.pwd.old_password && !this.pwd.new_password && !this.pwd.insure_password) {
                    returnText = "请输入账号密码"
                } else if (!this.pwd.old_password) {
                    returnText = "请输入账号"
                } else if (!this.pwd.new_password) {
                    returnText = "请输入密码"
                } else if (!this.pwd.insure_password) {
                    returnText = "密码不一致"
                } else if (this.pwd.new_password != this.pwd.insure_password) {
                    returnText = "密码不一致"
                } else {
                    return "注册"
                }
                return returnText
            }
        },
        methods: {
            valid() {
                 return this.pwd.old_password && this.pwd.new_password == this.pwd.insure_password
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
            // UserRegist(){
            //     var that = this
            //     if(that.valid()){
            //         authAPI.regist(that.loginInfo).then(function(result){
            //             //that.$vux.vux_alert.show({ content: '注册成功！' })
            //             const router = new VueRouter()
            //             router.go('login')                        
            //         }).catch(function(err){
            //             console.log(err)
            //             that.serverMsg = err
            //         })
            //     }
            // }
        },
        ready() {
            this.$els.pwd.focus()
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