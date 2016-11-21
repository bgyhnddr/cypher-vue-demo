<template>

<div style="min-height: 435px;">
	<div @keyup.enter="CommitVerification">
		<div>

			<div class="change-password">
				<group v-if="!UserPhone">
					<x-input title="手机号" :value.sync="cellphone" placeholder="请输入手机号" :required="false"></x-input>
				</group>
				<p v-if="UserPhone" class="Message-authentication ">请输入{{GetPhone}}短信验证码</p>
				<div class=" phone-button">
					<group class="weui_cells_form">
						<x-input title="验证码" class="weui_vcode" :value.sync="VerificationCode" placeholder="请输入验证码" :required="false">
							<x-button slot="right" type="default" @click="GetVerificationCode" :disabled="disable">{{btnMsg}}</x-button>
						</x-input>
					</group>
					<!-- <p v-if="showTime">{{TimeLeft}}秒重新发送</p> -->
					<p v-if="showErr"  class="phone-error">{{errmsg}}</p>
					</group>

				</div>
			</div>
			<flexbox style="margin-top:20px">
				<flexbox-item>
					<x-button type="primary" @click="CommitVerification ">完成</x-button>
				</flexbox-item>
			</flexbox>
			<div>
				<toast :show.sync="show" :time="1000" type="default">验证码已发送</toast>
			</div>
		</div>
	</div>


</div></div>
<div class="all-footer">© 2016 ShareWin.me 粤ICP备14056388号</div>



</template>

<script>
import authAPI from '../api/auth'
import VueRouter from 'vue-router'
import sendSMS from '../api/sendSMS'
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
			btnMsg: "获取验证码",
			CodeTime: 60,
			GetPhone: "",
			cellphone: "",
			VerificationCode: "",
			UserPhone: false,
			show: false,
			showErr: false,
			errmsg: "",
			disable: false
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
			return this.cellphone && this.VerificationCode
		},
		SetInterval() {
			var that = this
			that.disable = true
			var GetTime = setInterval(function() {
				if (that.CodeTime > 0) {
					that.CodeTime--
						that.btnMsg = that.CodeTime + '秒重新发送'
				} else if (that.CodeTime == 0) {
					that.btnMsg = "获取验证码"
					clearInterval(GetTime)
					that.disable = false
				}
			}, 1000)
		},
		GetVerificationCode() {
			var that = this
			if (that.cellphone || that.UserPhone) {
				sendSMS.SendSMS({
					cellphone: that.cellphone,
					mode: "SendVerificationCode"
				}).then(function(result) {
					that.showErr = false
					that.show = true
					that.SetInterval()
					console.log(result)
				}).catch(function(err) {
					console.log(err)
					that.showErr = true
					if (!isNaN(parseInt(err))) {
						that.errmsg = "获取过于频繁"
						that.CodeTime = 60 - err
						that.SetInterval()
					} else {
						that.errmsg = err
					}
				})
			}

		},
		CommitVerification() {
			var that = this
			if (that.valid()) {
				authAPI.CommitVerification({
					phone: that.cellphone,
					code: that.VerificationCode,
					locate: that.$route.params.locate
				}).then(function(result) {
					that.$router.go({
						path: '/auth/resetpwd/' + that.$route.params.locate
					})
					console.log(result)
				}).catch(function(err) {
					that.showErr = true
					that.errmsg = err
				})
			}

		}
	},
	watch: {
		cellphone() {
			this.showErr = false
		},
		VerificationCode() {
			this.showErr = false
		}
	},
	ready() {
		if (this.$route.params.locate == 'account') {
			var that = this
			that.UserPhone = true
			sendSMS.GetUserPhone().then(function(result) {
				that.GetPhone = result.value.substring(0, 3) + '****' + result.value.substring(8, 11)
				that.cellphone = result.value
			})
		}
		// this.$els.cellphone.focus()
	}
}
</script>
<style>
.phone-error{

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

.change-passwords {
	width: 89%;
	margin: 7% auto 5% auto;
}

.change-passwords .weui_cell_hd {
	width: 22%
}

.change-passwords .weui_label {
	color: #595959;
	font-size: 4.7vw;
	/*15px*/
	font-family: "微软雅黑";
	width: 100%!important;
	display: inline-block;
}

.change-passwords .weui_cells {
	border: 1px solid #d3d1d1;
	margin-bottom: 2%;
	border-radius: 3px;
}

.change-passwords .weui_cells input.weui_input {
	font-family: "微软雅黑";
	font-size: 4.5vw;/*14px*/

}

.change-passwords .weui_icon_warn:before {
	font-size: 16px;
	color: #f43530;
}

.phone-button button.weui_btn.weui_btn_default {
	color: #80c269;
	font-size: 4.5vw;
	/*14px*/
	font-family: "微软雅黑";
	border: 0;
	background: 0;
}

.phone-button .weui_btn:after {
	border: 0;
	height: 62px;
	margin-top: 7%;
	border-left: 1px solid #d3d1d1;
	border-radius: 0;
}

.again-send {
	text-align: right;
	font-size: 4.5vw;
	/*14px*/
	color: #aeaeae;
	font-family: "微软雅黑";
}

.frequent {
	font-size: 13px;
	color: #d22d23;
	font-family: "微软雅黑";
}

.Message-authentication {
	color: #aeaeae;
	text-align: center;
	margin-bottom: 4%;
	font-size: 4.7vw;
	font-family: "微软雅黑";
}
</style>
