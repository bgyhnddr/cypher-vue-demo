<template>
	<div @keyup.enter="CommitVerification">
			<div>
<div class="change-password">
                <group v-if="!UserPhone">
                    <x-input title="手机号" :value.sync="cellphone" placeholder="请输入手机号" is-type="china-mobile" v-ref:cellphone></x-input>
                </group>
                <p v-if="UserPhone">请输入{{GetPhone}}短信验证码</p>
                <!--<group>
                    <x-input title="验证码" :value.sync="VerificationCode" placeholder="请输入验证码"></x-input>
                </group>-->
   <div class=" phone-button">
                <group class="weui_cells_form">
                    <x-input title="验证码" class="weui_vcode" :value.sync="VerificationCode" placeholder="请输入验证码">
                        <x-button slot="right" type="default" @click="GetVerificationCode" :disabled="disable">获取验证码</x-button>                      
                    </x-input>
                </group>
                 <p v-if="showTime">{{TimeLeft}}秒重新发送</p>
                 <p v-if="showErr">{{errmsg}}</p>
                </group></div>
			</div>
            <flexbox style="margin-top:20px">
                <flexbox-item>
                    <x-button type="primary" @click="CommitVerification ">完成</x-button>
                </flexbox-item>
            </flexbox> 
            <div>
                <toast :show.sync="show" :time="1000" type="default">验证码已发送</toast>      
            </div>  
	</div></div>

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
                TimeLeft: "",
                GetPhone: "",
                cellphone: "",
                VerificationCode: "",
                UserPhone: false,
                show: false,
                showTime: false,
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
                    if (that.TimeLeft > 0) {
                        that.TimeLeft--
                    } else if (that.TimeLeft == 0) {
                        that.showTime = false
                        clearInterval(GetTime)
                        that.disable = false
                    }
                }, 1000)
            },
            GetVerificationCode() {
                var that = this
                if (that.cellphone || that.UserPhone) {
                    authAPI.GetVerificationCode({
                        phone: that.cellphone
                    }).then(function(result) {
                        that.showErr = false
                        that.show = true
                        that.TimeLeft = 30
                        that.showTime = true
                        that.SetInterval()

                        console.log(result)
                    }).catch(function(err) {
                        console.log(err)
                        that.showErr = true
                        if (err == "账号不存在") {
                            that.errmsg = err
                        } else {
                            that.errmsg = "获取过于频繁"
                            that.TimeLeft = 30 - err
                            that.showTime = true
                            that.SetInterval()
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
        ready() {
            if (this.$route.params.locate == 'account') {
                var that = this
                that.UserPhone = true
                authAPI.getUser().then(function(result) {
                    that.GetPhone = result.name.substring(0,3)+'****'+result.name.substring(8,11)
                    that.cellphone = result.name
                })
            }
            // this.$els.cellphone.focus()
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
    
    .change-password {
        width: 89%;
        margin: 7% auto;
    }
    
    .change-password .weui_cell_hd {
        width: 27%;
    }
    
    .change-password .weui_label {
        color: #595959;
        font-size: 15px;
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
    }
    
    .change-password .weui_icon_warn:before {
        font-size: 16px;
        color: #f43530;
    }
    
    .phone-button button.weui_btn.weui_btn_default {
        color: #80c269;
        font-size: 14px;
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
</style>