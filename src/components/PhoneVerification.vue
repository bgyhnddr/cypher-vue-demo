<template>
	<div @keyup.enter="CommitVerification">
			<div>
<div class="change-password">
                <group>
                    <x-input title="手机号" :value.sync="cellphone" placeholder="请输入手机号" is-type="china-mobile" v-ref:cellphone></x-input>
                </group>
                <!--<group>
                    <x-input title="验证码" :value.sync="VerificationCode" placeholder="请输入验证码"></x-input>
                </group>-->
   <div class=" phone-button">
                <group class="weui_cells_form">
                    <x-input title="验证码" class="weui_vcode" :value.sync="VerificationCode" placeholder="请输入验证码">
                        <x-button slot="right" type="default" @click="GetVerificationCode">{{BtnName}}</x-button>
                    </x-input>
                </group></div>
			</div>
            <flexbox style="margin-top:20px">
                <flexbox-item>
                    <x-button type="primary" @click="CommitVerification ">完成</x-button>
                </flexbox-item>
            </flexbox> 
            <div>
                <toast :show.sync="show" :time="1000" type="warn">{{errmsg}}</toast>      
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
                BtnName: "发送验证码",
                BtnTime: 60,
                cellphone: "",
                VerificationCode: "",
                show: false,
                state: window.state,
                serverMsg: "",
                errmsh: ""
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
            GetVerificationCode() {
                var that = this
                authAPI.GetVerificationCode({
                    phone: that.cellphone
                }).then(function(result) {
                    console.log(result)
                }).catch(function(err) {
                    console.log(err)
                    that.serverMsg = err
                })
            },
            CommitVerification() {
                var that = this
                authAPI.CommitVerification({
                    phone: that.cellphone,
                    code: that.VerificationCode
                }).then(function(result) {
                    console.log(result)
                }).catch(function(err) {
                    console.log(err)
                    that.serverMsg = err
                })
            }
        },
        ready() {
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

   .phone-button   button.weui_btn.weui_btn_default{

color: #80c269;
    font-size: 14px;
    font-family: "微软雅黑";
    border: 0;
    background: 0;


}


   .phone-button  .weui_btn:after{

    border: 0;
    height: 62px;
    margin-top: 7%;
    border-left: 1px solid #d3d1d1;
    border-radius: 0;

}
</style>