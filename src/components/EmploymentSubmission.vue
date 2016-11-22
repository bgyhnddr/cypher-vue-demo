<template>
    <div class="Application-is-successful ">
        <img src="/static/TestIMG/successful.png"/>
        <p>恭喜你，成功提交申请</p>
        <p>账户密码【<span>{{pwd}}</span>】</p>
        <p>*审核通过后可使用此密码登录，请妥善保管</p>
    </div>
      <div class="all-footer">© 2016 ShareWin.me 粤ICP备14056388号</div>
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
                    that.pwd = result
                    if (typeof(result) == 'object') {
                        that.$route.router.go('/auth/login')
                    }
                })
            }
        },
        ready() {
            this.getPwd()
        }
    }
</script>
<style>

.Application-is-successful {
    text-align: center;
    margin-top: 13%;
font-family: "微软雅黑";
min-height:444px;
}
.Application-is-successful img{
width: 19%;
    height: auto;


}
.Application-is-successful p:nth-child(2){
    font-size: 5.3vw;/*18px*/
    color: #852d25;
    font-weight: bold;
    font-family: "微软雅黑";

}
.Application-is-successful  p:nth-child(3){

  font-size: 3.9vw;/*12px*/
    color: #000000;
    margin-top: 8%;
}
.Application-is-successful  p:nth-child(3) span{
color: #852d25;

}
.Application-is-successful  p:nth-child(4){

  font-size: 3.9vw;/*12px*/
    color: #000000;
 margin-top: 2%;

}
</style>
