<template>
    <div class="Application-is-successfuls ">
        <img src="/static/TestIMG/successful.png"/>
        <p>成功修改密码</br>
        密码立即生效，请重新登录！</p>
        <p>*倒计时<span>{{time}}s</span>将自动跳转至登录页面</p>
    </div>
    <div class="all-footer">© 2016 ShareWin.me 粤ICP备14056388号</div>
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
    .Application-is-successfuls {
        text-align: center;
        margin-top: 13%;
        font-family: "微软雅黑";
        min-height: 443px;
    }

    .Application-is-successfuls img {
        width: 19%;
        height: auto;
    }

    .Application-is-successfuls p:nth-child(2) {
      font-size: 5.3vw;/*18px*/

        color: #852d25;
        font-weight: bold;
        font-family: "微软雅黑";
    }

    .Application-is-successfuls p:nth-child(3) {
        font-size: 3.9vw;/*12px*/
      color: #000000;
      margin-top: 4%;
    }

    .Application-is-successfuls p:nth-child(3) span {
        color: #f4604b;
    }


</style>
