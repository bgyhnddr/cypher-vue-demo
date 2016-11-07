<template>
    <div>
        <img class="vux-x-img ximg-demo" :src.sync="brand_logo_href" alt="品牌logo"/>
        <p>授权证书</p>
        <div>
            <p>兹授权</p>
            <p>姓名<label>张三</label></p>
            <p>微信<label>AA</label></p>
            <p>身份证<label>4404xxxxxxxxxxxxx</label></p>
            <img class="vux-x-img ximg-demo" alt="授权者头像"/></p>
            <p>为<label>{{employmentData.name}}</label><label>{{employer.brand_role_name}}</label></p>
            <p>允许其在网络上销售<label>{{employmentData.name}}</label><label>旗下产品</label></p>
            <p>授权编号<label>A111</label></p>
            <p>授权期限<label>{{date.start}}</label>至<label>{{date.deadline}}</label></p>
            <p>备注：本授权书以正本为有效文本，不得影印，涂改，转让。{{company_name}}有此授权书最终解释权。</p>
            <p>授权单位<label>{{company_name}}</label></p>
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
                    agent_guid: "",
                    user_account: "",
                    brand_role_code: "",
                    brand_role_name: ""
                },
                employmentData: {},
                date: {
                    start: "",
                    deadline: ""
                },
                brand_logo_href: null,
                company_name: null
            }
        },
        methods: {
            initData() {
                var that = this
                this.employer.user_account = this.$route.params.account
                this.employer.brand_role_code = this.$route.params.employableRole
                this.date.start = new Date().Format('yyyy-MM-dd')
                this.date.deadline = new Date(new Date().getTime() + 30 * 24 * 3600 * 1000).Format('yyyy-MM-dd')

                authAPI.getUser().then(function(result) {
                    if (result.name == that.employer.user_account) {
                        that.getEmploymentInfo()
                        that.getRoleName()
                        that.getAgentGuid()
                    } else {
                        that.$route.router.go('/auth/login')
                        return
                    }
                })
            },
            getEmploymentInfo() {
                var that = this
                console.log("正在获取品牌资料")

                employmentAPI.getBrandInfo({
                    user_account: this.employer.user_account
                }).then(function(result) {
                    console.log(JSON.stringify(result))
                    that.employmentData = result

                    that.createEmployment()
                    for (var item in result.brand_details) {
                        for (var meta in result.brand_details[item]) {
                            //key = "headImg"
                            if (meta == 'key' && result.brand_details[item][meta] == 'headImg') {
                                console.log(result.brand_details[item]['value'])
                                var brand_logo_href = parseInt(result.brand_details[item]['value'])
                                that.brand_logo_href = "/service/public/upload/getAttachment?id=" + brand_logo_href
                            }
                            //key = "headImg"
                            if (meta == 'key' && result.brand_details[item][meta] == 'companyName') {
                                console.log(result.brand_details[item]['value'])
                                that.company_name = result.brand_details[item]['value']
                            }
                        }
                    }
                }).catch(function(err) {
                    alert(err)
                })
            },
            getRoleName() {
                var that = this
                employmentAPI.getRoleName({
                    brand_role_code: that.employer.brand_role_code
                }).then(function(result) {
                    console.log(JSON.stringify(result))
                    that.employer.brand_role_name = result.name
                }).catch(function(err) {
                    window.alert(err)
                })
            },
            getAgentGuid() {
                var that = this
                employmentAPI.getAgentInfo({
                    user_account: that.employer.user_account
                }).then(function(result) {
                    console.log(JSON.stringify(result))
                    that.employer.agent_guid = result.guid
                }).catch(function(err) {
                    window.alert(err)
                })
            },
            goBackToEmploymentIndex() {
                this.$route.router.go('/employManagement')
            },
            createEmployment() {
                var that = this

                employmentAPI.createEmployment({
                    employer: this.employer,
                    employmentData: this.employmentData,
                    createTime: new Date().Format('yyyy-MM-dd hh:mm:ss')
                }).then(function(result) {
                    console.log(JSON.stringify(result))
                    that.showShareUrl(result)
                }).catch(function(err) {
                    window.alert(err)
                })
            },
            showShareUrl(employmentGuid) {
                console.log('/employManagement/fillInEmployment/' + employmentGuid)
            }
        },
        ready() {
            this.initData()
        }
    }
</script>