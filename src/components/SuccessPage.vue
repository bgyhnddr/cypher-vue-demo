<template>
    <div class="Application-is-successful ">
        <img src="/static/TestIMG/successful.png"/>
        <p>成功修改密码</p>
        <p>密码立即生效，请重新登录！</p>
        <p>*倒计时{{time}}s将自动跳转至登录页面</p>
    </div>
</template>
<script>
    import authAPI from '../api/auth'
    export default {
        data() {
            return {
                time: 5
            }
        },
        methods: {
            Countdown() {
                var that = this
                var num = 5
                var Count = setInterval(function() {
                    if (num > 0) {
                        num--
                        that.time = num
                    } else if (num == 0) {
                        clearInterval(Count)
                        authAPI.logout().then(function() {
                            that.$router.go({
                                path: '/index'
                            })
                        })

                    }
                }, 1000)
            }
        },
        ready() {
            this.Countdown()
        }
    }
</script>
<style>
    .Application-is-successful {
        text-align: center;
        margin-top: 13%;
        font-family: "微软雅黑";
    }
    
    .Application-is-successful img {
        width: 19%;
        height: auto;
    }
    
    .Application-is-successful p:nth-child(2) {
        font-size: 18px;
        color: #852d25;
        font-weight: bold;
        font-family: "微软雅黑";
    }
    
    .Application-is-successful p:nth-child(3) {
        font-size: 12px;
        color: #000000;
        margin-top: 8%;
    }
    
    .Application-is-successful p:nth-child(3) span {
        color: #852d25;
    }
    
    .Application-is-successful p:nth-child(4) {
        font-size: 12px;
        color: #000000;
        margin-top: 2%;
    }
</style>