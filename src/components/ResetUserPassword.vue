<template>
	<div style="    min-height: 460px;">
<div @keyup.enter="ChangePwd">
	<div>
		<div class="resetuser-password">
			<group>
				<x-input title="新密码":value.sync="pwd.new_password" type="password" placeholder="请输入新密码" :required="false"></x-input>
			</group>
			<group>
				<x-input title="确认密码" :value.sync="pwd.insure_password" type="password" placeholder="请再次输入新密码" :required="false"></x-input>
			</group>
		</div>
		<p class="resetuser-error">{{serverMsg}}</p>
		<flexbox style="margin-top:20px">
			<flexbox-item>
				<x-button type="primary" @click="ChangePwd">完成</x-button>
			</flexbox-item>
		</flexbox>
		<div>
			<alert :show.sync="showAlert" @on-hide="onHide" button-Text="确定">账号不存在</alert>
			<!--<toast :show.sync="show1" :time="1000" @on-hide="onHide">修改成功</toast>-->
			<!--<toast :show.sync="show2" :time="1000" @on-hide="onHide" type="warn">{{errmsg}}</toast>      -->
		</div>
	</div></div>
</div>
 <div class="all-footer">© 2016 ShareWin.me 粤ICP备14056388号</div>
</template>

<script>
import authAPI from '../api/auth'
import VueRouter from 'vue-router'
import {
	Alert,
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
			showAlert: false,
			show1: false,
			account: "",
			state: window.state,
			serverMsg: "",
			pwd: {
				new_password: "",
				insure_password: ""
			}
		}
	},
	components: {
		Alert,
		Toast,
		Group,
		XInput,
		XButton,
		Flexbox,
		FlexboxItem
	},
	methods: {
		valid() {
			return this.pwd.new_password && this.pwd.insure_password
		},
		onHide() {
			this.$router.go({
				path: '/index'
			})
		},
		ChangePwd() {
			var that = this
			if (that.valid()) {
				if (this.pwd.new_password == this.pwd.insure_password) {
					authAPI.resetuserpwd({
						account: that.account,
						pwd: that.pwd.new_password
					}).then(function(result) {
						that.$router.go({
							path: '/auth/SuccessPage'
						})
						console.log(result)
					}).catch(function(err) {
						console.log(err)
						that.serverMsg = err
					})
				} else {
					that.serverMsg = '密码不一致'
				}
			}
		}
	},
	ready() {
		var that = this
		authAPI.getAccount().then(function(result) {
				if (result.phone == null) {
				that.showAlert = true
				} else {
					that.account = result.phone
					console.log(result)
				}
			})
			//this.$els.pwd.focus()
	}
}
</script>
<style>
.resetuser-error{
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

.resetuser-password {
	width: 89%;
    margin: 7% auto 0 auto;
}

.resetuser-password .weui_cell_hd {
	width: 27%;
}

.resetuser-password .weui_label {
	color: #595959;
	font-size: 15px;
	font-family: "微软雅黑";
	width: 100%!important;
	display: inline-block;
}
.resetuser-password  .weui_cell {

  width: 94%;
  margin: 0 auto 0 auto;
  padding: 7px 3%;
  border-radius: 3px;
}
.resetuser-password .weui_cells {
	border: 1px solid #d3d1d1;
	margin-bottom: 2%;
	border-radius: 3px;
}

.resetuser-password .weui_cells input.weui_input {
	font-family: "微软雅黑";
	font-size: 4.5vw;
color: #aeaeae;
line-height: inherit;
height: auto;
}

.resetuser-password .weui_icon_warn:before {
	font-size: 16px;
	color: #f43530;
}
</style>
