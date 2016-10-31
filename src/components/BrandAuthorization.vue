<template>
    <p>*点击右上方分享，发送代理授权申请表</p>
    <div>
        <img alt="logo"/>
        <p>授权证书 <p>
        <div>
            <img alt="头像"/></p>
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
        </div>
	</div>
</template>
<script>
    import employment from '../api/employment'

    export default {
        data() {
            return {
                employer:{
                    user_account:"",
                    employee_role:"",
                },
                employmentData:{},
                date:{
                    start:"",
                    deadline:""
                }
            }
        },
        methods:{
            getEmploymentInfo(){
                var that = this
                console.log("正在获取品牌资料")
                employment.getBrandInfo({user_account:this.employer.user_account}).then(function(result) {
                    console.log(JSON.stringify(result))
                    that.employmentData = result
                    var todayDate = new Date(Date.parse(new Date().toLocaleDateString()));
                    that.date.start =  new Date().toLocaleDateString()
                    that.date.deadline = new Date(todayDate.getTime() + 30 * 24 * 3600 * 1000).toLocaleDateString()
                    console.log(JSON.stringify(that.date))
                }).catch(function(err) {
                    alert(err)
                })
            }
        },
        ready() {
            console.log(JSON.stringify(this.$route.matched.queryParams));
            this.employer.user_account = this.$route.matched.queryParams.employerAccount
            this.employer.employee_role = this.$route.matched.queryParams.employeeRole
            this.getEmploymentInfo()
        }
    }
</script>