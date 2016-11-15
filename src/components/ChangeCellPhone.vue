<template>
    <div>
<div class="changepcellphone-input">
        <group title ="新手机号">
            <x-input class="weui_cell_primary" title="+86" keyboard="number" :value.sync="cellphone" placeholder="输入新手机号" :show-clear=false 
            is-type="china-mobile" :required="false" v-ref:cellphone></x-input>
            <x-button type="primary" @click="confirm">确认修改</x-button>
            <alert :show.sync="showMsg" @on-hide="onHide()" button-text="确认">你已经成功修改手机号</alert>
            <alert :show.sync="showRemind" button-text="确认">{{errorMsg}}</alert>
        </group>
    </div></div>
</template>

<script>
    import {
        Group,
        XInput,
        XButton,
        Alert
    } from 'vux'
    import authAPI from '../api/auth'
    import changeUserInfoAPI from '../api/changeUserInfo'

    export default {
        data() {
            return {
                cellphone: "",
                showMsg: false,
                showRemind: false,
                errorMsg: null
            }
        },
        components: {
            Group,
            XInput,
            XButton,
            Alert
        },
        methods: {
            confirm() {
                var that = this

                //检测手机号输入是否正确
                if (!this.$refs.cellphone.valid) {
                    that.showRemind = true
                    that.errorMsg = "手机号填写错误，请重新输入"
                } else {
                    authAPI.getUser().then(function(userinfo) {

                        changeUserInfoAPI.changeCellphone({
                            user_account: userinfo.name,
                            cellphone: that.cellphone
                        }).then(function(result) {
                            if (result == true) {
                                that.showMsg = true
                            }
                        }).catch(function(err) {
                            that.showRemind = true
                            that.errorMsg = err
                        })

                    })
                }
            },
            onHide() {
                this.showMsg = false
                this.$route.router.go('/accountManagement')
            }
        }
    }
</script>
<style>
.changepcellphone-input .weui_label{
font-size: 15px;
    color: #000;
    font-family: "微软雅黑";

}
.changepcellphone-input .weui_input {
    width: 93%;
    border: 0;
    outline: 0;
    -webkit-appearance: none;
    background-color: transparent;
    font-size: inherit;
    color: inherit;
    height: 2.5em;
    line-height: 2em;
    border: 1px solid #d3d1d1;
    font-family: "微软雅黑";
    padding-left: 5%;
    color: #aeaeae;
    font-size: 14px;
}

.changepcellphone-input .weui_dialog_ft{

    width: 89%;
    margin: 8% auto;
    background: #fd5e5e;
    line-height: 35px;
    border-radius: 2px;


}
.changepcellphone-input .weui_dialog_bd
{
    color: #000000;
    font-size: 17px;
    font-family: "微软雅黑";
margin-top: 5%;

}
.changepcellphone-input .weui_btn_dialog.primary {
    font-size: 16px;
    color: #fff;
}
.changepcellphone-input .weui_dialog{
width: 92%;

}
</style>