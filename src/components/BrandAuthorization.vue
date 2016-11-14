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
                            <td width=18%;>姓名:</td>
                            <td class="color-gray">某某某</td>
                            <td rowspan="4" align="right"><img class="vux-x-img ximg-demo" alt="授权者头像" src="/static/TestIMG/grantee.jpg" /></td>
                        </tr>
                        <tr>
                            <td> 微信:</td>
                            <td class="color-gray">******微信号</td>
                        </tr>
                        <tr>
                            <td>身份证:</td>
                            <td class="color-gray">4404xxxxxxxxxxx52</td>
                        </tr>
                        <tr>
                            <td height="6px"></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
                <div class="set-agent ">为{{employmentData.name}}<label>{{brand_role_name}}</label></div>
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
    <alert :show.sync="showMsg" button-text="确认">{{errorMsg}}</alert>
</div>
</template>
<script>
    import {
        Alert
    } from 'vux'
    import authAPI from '../api/auth'
    import employmentAPI from '../api/employment'

    export default {
        components: {
            Alert
        },
        data() {
            return {
                employmentData: {},
                date: {
                    start: "",
                    deadline: ""
                },
                brand_logo_href: null,
                company_name: null,
                publishEmploymentData: {},
                brand_role_name: "",
                showMsg: false,
                errorMsg: null
            }
        },
        methods: {
            initData() {
                console.log("显示发起招募证书")
                var that = this
                var publishEmploymentID = this.$route.params.publishEmploymentID

                //获取发起招募信息
                employmentAPI.getPublishEmploymentInfo({
                    employmentGuid: publishEmploymentID
                }).then(function(result) {
                    console.log(JSON.stringify(result))
                    that.publishEmploymentData = result

                    //招募失效
                    var startDate = new Date(result.create_time)
                    var endDate = new Date(startDate.getTime() + 2 * 3600 * 1000)
                    if (endDate <= new Date()) {
                        that.showMsg = true
                        that.errorMsg = "招募已失效"
                        that.$route.router.go('/auth/login')
                    } else {
                        //判断用户类型
                        that.getBrandInfo()
                        authAPI.getUser().then(function(result) {
                            if (result.name == that.publishEmploymentData.employer_user_account) {
                                that.getRoleName()
                            } else {
                                that.$route.router.go('/employManagement/fillInEmployment/' + publishEmploymentID + '/' + that.employmentData.name)
                            }
                        })
                    }
                }).catch(function(err) {
                    that.showMsg = true
                    that.errorMsg = err
                })

                this.date.start = new Date().Format('yyyy-MM-dd')
                this.date.deadline = new Date(new Date().getTime() + 30 * 24 * 3600 * 1000).Format('yyyy-MM-dd')
            },
            getBrandInfo() {
                var that = this
                console.log("正在获取品牌资料")

                employmentAPI.getBrandInfo({
                    user_account: this.publishEmploymentData.employer_user_account
                }).then(function(result) {
                    console.log(JSON.stringify(result))
                    that.employmentData = result

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
                    that.showShareUrl()
                }).catch(function(err) {
                    that.showMsg = true
                    that.errorMsg = err
                })
            },
            getRoleName() {
                var that = this
                employmentAPI.getRoleName({
                    brand_role_code: this.publishEmploymentData.brand_role_code
                }).then(function(result) {
                    console.log(JSON.stringify(result))
                    that.brand_role_name = result.name
                }).catch(function(err) {
                    that.showMsg = true
                    that.errorMsg = err
                })
            },
            showShareUrl(employmentGuid) {
                console.log("填写资料跳转地址：" + '/employManagement/fillInEmployment/' + this.$route.params.publishEmploymentID + '/' + this.employmentData.name)
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
        width: 74%;
        height: auto;
        margin-right: 18%;
        min-height: 76px;
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
        margin: 8% 0 10% 0;
        text-align: left;
    }
    
    .agent-message p {
        text-align: left;
        font-family: "微软雅黑";
    }
    
    .agent-unit {
        font-family: "微软雅黑";
        text-align: right;
        margin-bottom: 29%
    }
</style>