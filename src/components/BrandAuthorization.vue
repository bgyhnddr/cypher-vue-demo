<template>
    <div>
        <p>*点击右上方分享，发送代理授权申请表</p>
        <img class="vux-x-img ximg-demo" alt="logo"/>
        <p>授权证书 <p>
        <div>
            <img class="vux-x-img ximg-demo" alt="头像"/></p>
            <p>兹授权</p>
            <p>姓名<label>张三</label></p>
            <p>>微信<label>AA</label></p>
            <p>账号<label>AA</label></p>
            <p>身份证<label>4404xxxxxxxxxxxxx</label></p>
            <p>为<label>{{employmentData.name}}</label><label>{{employer.employee_role}}</label></p>
            <p>允许其在网络上销售<label>{{employmentData.company_name}}</label><label>旗下产品</label></p>
            <p>授权编号<label>{{employmentData.guid}}</label></p>
            <p>授权期限<label>{{date.start}}</label>至<label>{{date.deadline}}</label></p>
            <p>授权单位<label>{{employmentData.company_name}}</label></p>
            <button class="weui_btn weui_btn_primary" :class="classes" @click="goBackToEmploymentIndex">回到招募首页</button>
        </div>
    </div>
</template>
<script>
    import authAPI from '../api/auth'
    import employment from '../api/employment'

    export default {
        data() {
            return {
                employer: {
                    user_account: "",
                    employee_role: "",
                },
                employmentData: {},
                date: {
                    start: "",
                    deadline: ""
                }
            }
        },
        methods: {
            getEmploymentInfo() {
                var that = this
                console.log("正在获取品牌资料")
                employment.getBrandInfo({
                    user_account: this.employer.user_account
                }).then(function(result) {
                    console.log(JSON.stringify(result))
                    that.employmentData = result
                    var todayDate = new Date(Date.parse(new Date().toLocaleDateString()));
                    that.date.start = new Date().toLocaleDateString()
                    that.date.deadline = new Date(todayDate.getTime() + 30 * 24 * 3600 * 1000).toLocaleDateString()
                }).catch(function(err) {
                    alert(err)
                })
            },
            goBackToEmploymentIndex() {
                this.$route.router.go('/employManagement')
            }
        },
        ready() {
            var that = this

            this.employer.user_account = this.$route.params.employerAccount
            this.employer.employee_role = this.$route.params.employeeRole
            authAPI.getUser().then(function(result) {
                if (result.name == that.employer.user_account) {
                    that.getEmploymentInfo()
                } else {
                    window.alert("跳转到用户填写界面")
                }
            })

        }
    }
</script>