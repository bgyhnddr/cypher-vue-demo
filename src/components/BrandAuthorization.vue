<template>
    <div>
        <img class="vux-x-img ximg-demo" alt="logo"/>
        <p>授权证书</p>
        <div>
            <p>兹授权</p>
            <p>姓名<label>张三</label></p>
            <p>微信<label>AA</label></p>
            <p>身份证<label>4404xxxxxxxxxxxxx</label></p>
            <img class="vux-x-img ximg-demo" alt="头像"/></p>
            <p>为<label>{{employmentData.name}}</label><label>{{employer.brand_role_name}}</label></p>
            <p>允许其在网络上销售<label>{{employmentData.company_name}}</label><label>旗下产品</label></p>
            <p>授权编号<label>{{employmentData.guid}}</label></p>
            <p>授权期限<label>{{date.start}}</label>至<label>{{date.deadline}}</label></p>
            <p>备注：本授权书以正本为有效文本，不得影印，涂改，转让。{{employmentData.company_name}}有此授权书最终解释权。</p>
            <p>授权单位<label>{{employmentData.company_name}}</label></p>
            <button class="weui_btn weui_btn_primary" :class="classes" @click="goBackToEmploymentIndex">回到招募首页</button>
        </div>
    </div>
</template>
<script>
    import authAPI from '../api/auth'
    import employmentAPI from '../api/employment'

    export default {
        data() {
            return {
                employer: {
                    user_account: "",
                    brand_role_code: "",
                    brand_role_name: ""
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

                employmentAPI.getBrandInfo({
                    user_account: this.employer.user_account
                }).then(function(result) {
                    console.log(JSON.stringify(result))
                    that.employmentData = result
                    var startDate = new Date(that.date.start)
                    that.date.deadline = new Date(startDate.getTime() + 30 * 24 * 3600 * 1000).Format('yyyy-MM-dd')
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
            this.employer.user_account = this.$route.params.account
            this.employer.brand_role_code = this.$route.params.employableRole
            var startTime = this.$route.params.startTime
            this.date.start = new Date(parseInt(startTime)).Format('yyyy-MM-dd')

            authAPI.getUser().then(function(result) {
                if (result.name == that.employer.user_account) {
                    that.getEmploymentInfo()
                } else {
                    that.$route.router.go('/employManagement/fillInEmployment/' + that.employer.user_account +
                        '/' + that.employer.brand_role_code + '/' + parseInt(startTime))
                }
            })

            employmentAPI.getRoleName({
                brand_role_code: that.employer.brand_role_code
            }).then(function(result) {
                console.log(JSON.stringify(result))
                that.employer.brand_role_name = result.name
            }).catch(function(err) {
                window.alert(err)
            })

        }
    }
</script>