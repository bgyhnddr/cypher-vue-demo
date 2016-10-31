<template>
	<div @keyup.enter="ChangePwd">
			<div class="modal-body">
				<p :type="alertType">
					{{alertText}}
				</p>
                <div class="form-group">
					<label class="control-label">旧密码</label>
					<input v-el:pwd v-model="pwd.old_password" class="form-control"  type="password">
                </div>
                <div class="form-group">
					<label class="control-label">新密码</label>
					<input v-el:pwd v-model="pwd.new_password" class="form-control"  type="password">
                </div>  
                <div class="form-group">
					<label class="control-label">再次输入新密码</label>
					<input v-el:pwd v-model="pwd.insure_password" class="form-control"  type="password">
                </div>                 
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-success" @click="ChangePwd">确认修改</button>
			</div>
            <div>
                <toast :show.sync="show" :time="1000" @on-hide="onHide">修改成功</toast>     
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
                pwd: {
                    old_password: "",
                    new_password: "",
                    insure_password:""
                }
            }
        },
        components: {
            Toast,
            Group
        },
        computed: {
            alertType() {
                return this.valid() ? "success" : "warning"
            },
            alertText() {
                if (this.serverMsg) {
                    return this.serverMsg;
                }
                let returnText = "确认修改";
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
                    return "确认修改"
                }
                return returnText
            }
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