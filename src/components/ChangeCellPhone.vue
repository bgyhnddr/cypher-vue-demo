<template>
    <div>
        <group title ="新手机号">
            <x-input class="weui_cell_primary" title="+86" keyboard="number" :value.sync="cellphone" placeholder="输入新手机号" :show-clear=false 
            is-type="china-mobile" :required="false" v-ref:cellphone></x-input>
            <x-button type="primary" @click="confirm">确认修改</x-button>
            <alert :show.sync="showMsg" @on-hide="onHide()" button-text="确认">你已经成功修改手机号</alert>
            <alert :show.sync="showRemind" button-text="确认">{{errorMsg}}</alert>
        </group>
    </div>
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

</style>