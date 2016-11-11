<template>
    <div>
        <div class="brandauthorization-bac">
            <div class="brandauthorizations">
                <div class="brandauthorization-img">
                    <p class="brand-logo"><img class="vux-x-img ximg-demo" :src.sync="brand_logo_href" alt="品牌logo" /></p>
                    <p><img src="/static/TestIMG/authorization.png" class="authorization" /></p>
                </div>
                <div>
                    <h3>兹授权</h3>
                    <table boder=0 class="personal-identity">
                        <tbody>

                            <tr>
                                <td width="20%">姓名:</td>
                                <td class="color-gray">张三</td>
                                <td rowspan="4" align="right"><img class="vux-x-img ximg-demo" alt="授权者头像" src="/static/TestIMG/grantee.jpg" /></td>
                            </tr>
                            <tr>
                                <td> 微信:</td>
                                <td class="color-gray">AA</td>
                            </tr>
                            <tr>
                                <td>身份证:</td>
                                <td class="color-gray">4404xxxxxxxxxxxxx</td>
                            </tr>
                            <tr>
                                <td height="6px"></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="set-agent ">为{{employmentData.name}}<label>{{employer.brand_role_name}}</label></div>
                    <div class="allow-agent"> 允许其在网络上销售{{employmentData.name}}<label>旗下产品</label></div>
                    <div class="agent-message">
                        <p>授权编号:<label class="color-gray">A111</label></p>
                        <p>授权期限:<label class="color-gray">{{date.start}}</label>至
                            <label class="color-gray">{{date.deadline}}</label>
                        </p>
                    </div>

                    <p class="agent-unit ">授权单位:<label class="color-gray">{{company_name}}</label></p>


                </div>
            </div>
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
                        window.alert("您暂没有权限查看他人创建的招募证书")
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
                            //key = "LOGOImg"
                            if (meta == 'key' && result.brand_details[item][meta] == 'LOGOImg') {
                                console.log(result.brand_details[item]['value'])
                                var brand_logo_href = parseInt(result.brand_details[item]['value'])
                                that.brand_logo_href = "/service/public/upload/getAttachment?id=" + brand_logo_href
                            }
                            //key = "companyName"
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
                    that.$route.router.go('/employManagement/chooseEmployableRoles')
                })
            },
            showShareUrl(employmentGuid) {
                console.log('/employManagement/fillInEmployment/' + employmentGuid + "/" + this.$route.params.brandName)
            }
        },
        ready() {
            this.initData()
        }
    }
</script>
<style>
    /*底部距离*/
    
    .weui_tab_bd {
        padding-bottom: 0;
    }
    
    .brandauthorization-bac {
        background: url(/static/TestIMG/PowerOfAttorney-bac.png) no-repeat;
        background-size: 100%;
        width: 98%;
        margin: 3% auto;
    }
    
    .brandauthorizations {
        width: 75%;
        margin: auto;
        padding: 13% 0%;
        font-size: 0.3em;
        color: #3f3a36;
    }
    
    .brandauthorization-img .brand-logo img {
        width: 60%;
        height: auto;
    }
    
    .brandauthorization-img h3 {
        font-family: " 微软雅黑";
    }
    
    .authorization {
        width: 60%;
        height: auto;
    }
    
    .brandauthorization-img {
        text-align: center;
    }
    
    table.personal-identity {
        font-family: "微软雅黑";
        width: 100%;
        margin: auto;
    }
    
    table.personal-identity tbody tr td {
        font-family: "微软雅黑";
    }
    
    table.personal-identity tbody tr td img {
        width: 88%;
        height: auto;
    }
    
    .color-gray {
        color: #57534d;
    }
    
    .set-agent {
        font-family: "微软雅黑";
        text-align: center;
    }
    
    .set-agent label {
        font-size: 12px!important;
        color: #36bdaf;
        font-family: "微软雅黑";
    }
    
    .allow-agent {
        text-align: center;
        font-family: "微软雅黑";
    }
    
    .agent-message {
        margin: 8% 0 17% 0;
        text-align: left;
    }
    
    .agent-message p {
        text-align: left;
        font-family: "微软雅黑";
    }
    
    .agent-unit {
        font-family: "微软雅黑";
        text-align: right;
        margin-bottom: 14%;
    }
</style>