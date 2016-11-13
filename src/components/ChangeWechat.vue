<template>
    <div>
        <group title ="新的微信号">
            <x-input class="weui_cell_primary" :value.sync="wechat" placeholder="输入新的微信号" type="text" :show-clear=false 
            :min="6" :max="20" v-ref:wechat></x-input>
            <x-button type="primary" @click="confirm">确认修改</x-button>
            <alert :show.sync="showMsg" @on-hide="onHide(showMsg)">你已经成功修改微信号</alert>
            <alert :show.sync="showRemind" @on-hide="onHide(showRemind)">微信号需填写以字母开头，由6-20个字母，数字，下划线或减号组成的字符串，请再次输入微信号</alert>
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
                wechat: "",
                showMsg: false,
                showRemind: false
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
                var reg = /^[a-zA-Z]+[a-zA-Z0-9_]*$/ //微信号

                //检测微信账号输入是否正确
                if (!this.$refs.wechat.valid || !reg.test(this.wechat)) {
                    that.showRemind = true
                } else {
                    authAPI.getUser().then(function(result) {

                        changeUserInfoAPI.changeWechat({
                            user_account: result.name,
                            wechat: that.wechat
                        }).then(function(result) {
                            if (result == true) {
                                that.showMsg = true
                            }
                        }).catch(function(err) {
                            window.alert(err)
                        })

                    }).catch(function(err) {
                        window.alert(err)
                    })
                }
            },
            onHide(msg) {
                if (msg == 'showMsg') {
                    this.showMsg = false
                } else if (msg == 'showRemind') {
                    this.showRemind = false
                }
            }
        }
    }
</script>
<style>

</style>