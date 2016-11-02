<template>
    <div>
        <i class="weui_icon_msg weui_icon_success"></i>
        <p>恭喜你，成功提交申请</p>
        <p>账户密码【{{pwd}}】</p>
        <p>*审核通过后可使用此密码登录，请妥善保管</p>
    </div>
</template>
<script>
    import applyEmploymentAPI from '../api/applyEmployment'

    export default {
        data() {
            return {
                pwd: ""
            }
        },
        methods: {
            getPwd() {
                var that = this
                applyEmploymentAPI.getPwd().then(function(result) {
                    console.log(result)
                    that.pwd = result
                })
            }
        },
        ready() {
            this.getPwd()
        }
    }
</script>