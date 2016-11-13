<template>
    <div>
        <group>
            <x-input class="weui_cell_primary" :value.sync="pwd" placeholder="输入登录密码" type="password" :show-clear=false :equal-with="password"></x-input>
            <x-button type="primary" @click="cheakPwd">下一步</x-button>
        </group>
    </div>
</template>

<script>
    import {
        Group,
        XInput,
        XButton
    } from 'vux'
    import authAPI from '../api/auth'
    import changeUserInfoAPI from '../api/changeUserInfo'

    export default {
        data() {
            return {
                pwd: ""
            }
        },
        components: {
            Group,
            XInput,
            XButton
        },
        methods: {
            cheakPwd() {
                var that = this
                console.log("检测 密码")
                console.log(that.pwd)

                authAPI.getUser().then(function(result) {

                    changeUserInfoAPI.checkPwd({
                        user_account: result.name,
                        pwd: that.pwd
                    }).then(function(result) {
                        if (result == true) {
                            console.log(result)
                            if (that.$route.params.from == 'wechat') {
                                that.$route.router.go('/accountManagement/changeWechat')
                            } else if (that.$route.params.from == 'phone') {
                                //修改手机号
                            }
                        }
                    }).catch(function(err) {
                        window.alert(err)
                    })

                }).catch(function(err) {
                    window.alert(err)
                })
            }
        }
    }
</script>
<style>

</style>