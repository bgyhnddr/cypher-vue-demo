<template>
	<div style="    min-height: 440px;">
<div @keyup.enter="ChangePwd">
	<div>
		<div class="change-password">
			<group>
				<x-input title="旧密码" :value.sync="pwd.old_password" type="password" placeholder="请输入旧密码" :required="false" @on-change="change"></x-input>
			</group>
			<group>
				<!--<x-input title="请输入6位数的支付密码" type="text" placeholder="" :value.sync="password" :min="6" :max="6" @on-change="change"></x-input>-->
				<x-input title="新密码" :value.sync="pwd.new_password" type="password" placeholder="请输入新密码" :required="false" @on-change="change"></x-input>
			</group>
			<group>
				<!--<x-input title="请输入新的6位数的支付密码" type="text" placeholder="" :value.sync="password" :min="6" :max="6" @on-change="change"></x-input>-->
				<x-input title="确认密码" :value.sync="pwd.insure_password" type="password" placeholder="请再次输入新密码" :required="false" @on-change="change"></x-input>
			</group>
			<p v-if="show2" class="password-error">{{errmsg}}</p>

		</div>
		<div>
			<div class="forget-buttons">
				<x-button mini v-link="{path: '/auth/PhoneVerification/account'}">忘记原密码？</x-button>
			</div>
		</div>
		<flexbox style="margin-top:20px">
			<flexbox-item>
				<x-button type="primary" @click="ChangePwd">完成</x-button>
			</flexbox-item>
		</flexbox>
		<div>
			<!--<toast :show.sync="show1" :time="1000" @on-hide="onHide">修改成功</toast>-->
			<!-- <toast :show.sync="show2" :time="1000" @on-hide="onHide" type="warn">{{errmsg}}</toast> -->
		</div>
	</div>
</div></div>
<div class="login-footer">© 2016 ShareWin.me 粤ICP备14056388号</div>
</template>

<script>
import authAPI from '../api/auth'
import VueRouter from 'vue-router'
import {
	Toast,
	XInput,
	Group,
	XButton,
	Flexbox,
	FlexboxItem
} from 'vux'
export default {
	data() {
		return {
			// show1: false,
			show2: false,
			errmsg: "",
			state: window.state,
			serverMsg: "",
			pwd: {
				old_password: "",
				new_password: "",
				insure_password: ""
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
			return this.pwd.old_password && this.pwd.new_password && this.pwd.insure_password
		},
		change(val){
			this.show2 = false
		},
		onHide() {
			if (this.errmsg == "请先登录") {
				const router = new VueRouter()
				this.$router.go('login')
			}
		},
		ChangePwd() {
			var that = this
			if (that.valid()) {
				if (this.pwd.new_password != this.pwd.insure_password) {
					that.errmsg = "密码不一致"
					that.show2 = true
				} else {
					authAPI.changeuserpwd(that.pwd).then(function(result) {
						that.$router.go({
							path: '/auth/SuccessPage'
						})
						console.log("success")
					}).catch(function(err) {
						that.errmsg = err
						that.show2 = true
						console.log(err)
						that.serverMsg = err
					})
				}
			}
		}
	},
	ready() {
		//this.$els.pwd.focus()
	}
}
</script>
<style>
.change-password .password-error{

	width: 100%;
			margin: auto ;
			color: #d22d23;
			font-family: "微软雅黑";
			font-size: 4.1vw;
}
.login_zindex {
	z-index: 10000000 !important;
}

.login_loading_zindex {
	z-index: 10000001 !important;
}

.change-password {
	width: 89%;
	margin: 7% auto;
}
.change-password .weui_cell {

  width: 92%;
  margin: 0 auto;
  padding:7px 3%;
  border-radius: 3px;
}
.change-password .weui_cell_hd {
	width: 27%;
}

.change-password .weui_label {
	color: #595959;
	font-size: 4.7vw!important;
	font-family: "微软雅黑";
	width: 100%!important;
	display: inline-block;
}

.change-password .weui_cells {
	border: 1px solid #d3d1d1;
	margin-bottom: 2%;
	border-radius: 3px;
}

.change-password .weui_cells input.weui_input {
	font-family: "微软雅黑";
	    font-size: 4.5vw;
}

.change-password .weui_icon_warn:before {
	font-size: 4.9vw;
	/*16px*/
	color: #f43530;
}

.forget-buttons {
	width: 95%;
	margin: -5px auto 0 auto;
	text-align: right;

}

.forget-buttons button.weui_btn.weui_btn_mini.weui_btn_default {
	font-family: "微软雅黑";
	color: #1191e3;
	border: 0;
    font-size: 4.9vw;
	/*16px*/
	background: none;
	text-decoration: underline;
}

.forget-buttons .weui_btn:after {
	border: 0
}
.change-password .vux-flex-row{

	    margin-top: 5px!important;
}
</style>
