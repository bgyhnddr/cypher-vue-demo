<template>
<div class="login-bac">
	<div @keyup.enter="submitLogin">
		<div>
			<div class="vux-center login-header">
				<img class="vux-x-img ximg-demo vux-center" alt="头像" src="/static/TestIMG/brand_logo_href.png" />
				<p>Cara Cara</p>
			</div>
			<div class="login-message">
				<div class="user">
					<img src="/static/TestIMG/user.png" />
				</div>
				<div class="input-boder">
					<group>
						<x-input title="账号" :value.sync="loginInfo.account" placeholder="请输入手机号/平台账号" :required="false" @on-change="change"></x-input>
					</group>
					<div class="password">
						<img src="/static/TestIMG/password.png" />
					</div>
				</div>
				<div class="input-boder">
					<group>
						<!--<x-input title="请输入6位数字" type="text" placeholder="" :value.sync="password" :min="6" :max="6" @on-change="change"></x-input>-->
						<x-input title="密码" :value.sync="loginInfo.password" type="password" placeholder="请输入密码" :required="false" @on-change="change"></x-input>
					</group>
				</div>
			</div>
		</div>
			<p v-if="show" class="login-error">{{errmsg}}</p>
		<div class="forget-button">
			<x-button mini v-link="{path: '/auth/PhoneVerification/login'}">忘记密码？</x-button>
		</div>

		<flexbox style="margin-top:20px">
			<flexbox-item>
				<x-button type="primary" @click="submitLogin">登录</x-button>
			</flexbox-item>
			<!--<div style="display: none;"> <flexbox-item>
                    <x-button type="warn" v-link="{ path: '/auth/regist' }">账户注册</x-button>
                </flexbox-item></div>-->
		</flexbox>
<!--
		<div>
			<toast :show.sync="show" :time="1000" type="warn">{{errmsg}}</toast>
		</div> -->

	</div>
</div>
<div class="all-footer">© 2016 ShareWin.me 粤ICP备14056388号</div>
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
			show: false,
			errmsg: "",
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
		FlexboxItem,
		Toast
	},
	methods: {
		valid() {
			return this.loginInfo.account && this.loginInfo.password
		},
		change(val){
				this.show = false
		},
		submitLogin() {
			var that = this
			if (that.valid()) {
				authAPI.login(that.loginInfo).then(function(result) {
					that.state.userInfo = result
					that.$route.router.go('/homePage')
					console.log(that.state.userInfo)
				}).catch(function(err) {
					that.errmsg = err
					that.show = true
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
.login-error{

	width: 89%;
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

.login-bac {
	font-family: "微软雅黑";
	min-height: 460px;
}


/*品牌商logo*/

.login-header {
	background: url("/static/TestIMG/logo_header.png") no-repeat;
	background-size: cover;
	padding: 6%;
	text-align: center;
	display: block;
}

.login-header img {
	width: 27%;
	height: auto;
	border: 2px solid #fff;
	border-radius: 50%;
	display: initial;
}

.login-header p {
	display: block;
	color: #fff;
	font-size: 5.3vw;
	/*18px*/
}


/*登录框*/

.input-boder {
	border: 1px solid #d3d1d1;
	border-radius: 3px;
	background: #fff;
	margin-bottom: 2%;
}

.login-message {
	width: 89%;
	margin: 20px auto 0 auto;
	position: relative;
}

.login-bac .weui_cell {
	padding: 4% 15px;
}

.login-bac .weui_cells {
	margin-top: 0;
	font-size: 1em;
	/*16px*/
	color: #aeaeae;
	font-family: "微软雅黑";
}

.weui_cells:before {
	border-top: none;
}

.weui_cells:after {
	border-bottom: none;
}

.login-message input {
	font-family: "微软雅黑";
}

.weui_label {
	color: #fff;
	width: 2em!important;
}

.user {
	position: absolute;
	z-index: 10000;
	top: 9%;
	left: 3%;
	width: 19%;
}

.password {
	position: absolute;
	z-index: 10000;
	top: 60%;
	left: 3%;
	width: 21%;
}

.user img,
.password img {
	width: 51%;
	height: auto;
}


/*登录*/

button.weui_btn.weui_btn_primary {
	width: 89%;
	line-height: 2.2;
	background: #21c36d;
	font-family: "微软雅黑";
	font-size: 5.2vw;
	/*17px*/
	border-radius: 3px;
}

button.weui_btn.weui_btn_primary:active {
	background: #21935a;
}

.weui_icon_warn:before {
	font-size: 18px;
	color: #f43530;
}


/*隐藏返回按钮*/

a.vux-header-back.headerTransition-transition {
	display: none;
}


/*顶栏*/

.vux-header {}


/*忘记密码*/

.forget-button {
	width: 94%;
	margin: -5px auto 0 auto;
	text-align: right;
}

.forget-button button.weui_btn.weui_btn_mini.weui_btn_default {
	font-family: "微软雅黑";
	color: #1191e3;
	border: 0;
	font-size: 4.9vw;
	/*13px*/
	background: none;
	text-decoration: underline;
}

.forget-button .weui_btn:after {
	border: 0
}

.all-footer {
	width: 100%;
	text-align: center;
	color: #979797;
	font-size: 3vw;
	font-family: "微软雅黑";
	line-height: 2.5em;
	    margin-bottom: 10%;
}

.login-message input {
	height: auto;
}
</style>
